import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { Review } from '../models/Review';
import { ReturnRequest } from '../models/ReturnRequest';
import { AppError } from '../utils/errors';
import { sendShippingUpdate } from '../services/emailService';

// GET /api/v1/orders — user's order history
export async function getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const orders = await Order.find({ user: req.user!.id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/orders/:id — single order detail
export async function getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return next(new AppError(404, 'NOT_FOUND', 'Order not found.'));
        // Ensure user owns this order or is the seller
        if (String(order.user) !== req.user!.id && !order.seller?.includes(req.user!.id)) {
            return next(new AppError(403, 'FORBIDDEN', 'Access denied.'));
        }
        res.json(order);
    } catch (err) {
        next(err);
    }
}

// PATCH /api/v1/orders/:id/tracking — seller updates tracking
export async function updateOrderTracking(req: Request, res: Response, next: NextFunction) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return next(new AppError(404, 'NOT_FOUND', 'Order not found.'));
        if (!order.seller?.includes(req.user!.id)) {
            return next(new AppError(403, 'FORBIDDEN', 'Only the seller can update tracking.'));
        }

        const { status, carrier, trackingNumber, trackingUrl } = req.body;
        if (status) {
            order.status = status;
            order.statusLabel = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
            // Update timeline
            const entry = { status, timestamp: new Date(), completed: true };
            if (!order.tracking) order.tracking = { carrier: null, trackingNumber: null, trackingUrl: null, timeline: [] };
            order.tracking.timeline.push(entry);
        }
        if (carrier) order.tracking.carrier = carrier;
        if (trackingNumber) order.tracking.trackingNumber = trackingNumber;
        if (trackingUrl) order.tracking.trackingUrl = trackingUrl;
        if (status === 'delivered') {
            order.deliveredAt = new Date();
            order.canReview = true;
            order.canReturn = true;
            order.returnWindowEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        }

        await order.save();
        res.json(order);
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/orders/:id/review — submit review for order
export async function submitReview(req: Request, res: Response, next: NextFunction) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return next(new AppError(404, 'NOT_FOUND', 'Order not found.'));
        if (String(order.user) !== req.user!.id) return next(new AppError(403, 'FORBIDDEN', 'Access denied.'));

        const { rating, title, content, productId } = req.body;
        const review = await Review.create({
            product: productId || order.items[0]?.productId,
            author: { userId: req.user!.id, name: req.body.authorName || 'Customer' },
            rating,
            title,
            content,
            verified: true,
        });

        order.canReview = false;
        await order.save();
        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/orders/:id/return — submit return request
export async function submitReturn(req: Request, res: Response, next: NextFunction) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return next(new AppError(404, 'NOT_FOUND', 'Order not found.'));
        if (String(order.user) !== req.user!.id) return next(new AppError(403, 'FORBIDDEN', 'Access denied.'));

        const returnRequest = await ReturnRequest.create({
            order: order._id,
            user: req.user!.id,
            seller: order.seller?.[0] || undefined, // ReturnRequest expects a single seller string
            items: req.body.items || [{ orderItemId: order.items[0]?.id, reason: req.body.reason, resolution: req.body.resolution || 'refund_original' }],
            customerName: req.body.customerName || 'Customer',
        });

        order.canReturn = false;
        await order.save();
        res.status(201).json(returnRequest);
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/orders — seller's received orders
export async function getSellerOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const orders = await Order.find({ seller: { $in: [req.user!.id] } }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/stats — seller dashboard KPIs
export async function getSellerStats(req: Request, res: Response, next: NextFunction) {
    try {
        const sellerId = req.user!.id;
        const { Product } = await import('../models/Product');
        const { User } = await import('../models/User');

        const user = await User.findById(sellerId).select('sellerProfile.verified');
        const isVerified = user?.sellerProfile?.verified || false;

        const [totalOrders, deliveredOrders, allOrders, activeListings, returnsCount] = await Promise.all([
            Order.countDocuments({ seller: { $in: [sellerId] } }),
            Order.countDocuments({ seller: { $in: [sellerId] }, status: 'delivered' }),
            Order.find({ seller: { $in: [sellerId] } }).select('total status'),
            Product.countDocuments({ seller: sellerId, status: 'active' }),
            ReturnRequest.countDocuments({ seller: sellerId, status: { $in: ['pending', 'approved', 'inspecting'] } })
        ]);

        const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = allOrders.filter(o => ['confirmed', 'processing', 'pending'].includes(o.status)).length;

        // Trust Score logic: scale up to 100 based on verified status, volume, and active catalog
        let trustScore = 50;
        if (isVerified) trustScore += 10;
        trustScore += Math.min(25, totalOrders * 2);
        trustScore += Math.min(15, activeListings);
        // Penalize slightly for pending return requests
        trustScore -= Math.min(20, returnsCount * 5);
        trustScore = Math.max(0, Math.min(100, trustScore)); // clamp between 0-100

        res.json({
            revenue: `₹${(totalRevenue / 1000).toFixed(1)}k`,
            orders: totalOrders.toString(),
            listings: activeListings.toString(),
            conversion: totalOrders > 0 ? '2.4%' : '0%', // Mocked conversion for now
            pendingOrders,
            returns: returnsCount,
            totalRevenue,
            averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
            trustScore,
            isVerified
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/returns — seller's return requests
export async function getSellerReturns(req: Request, res: Response, next: NextFunction) {
    try {
        const returns = await ReturnRequest.find({ seller: req.user!.id }).sort({ createdAt: -1 });
        res.json({ returns });
    } catch (err) {
        next(err);
    }
}

// PATCH /api/v1/seller/returns/:id — update return status
export async function updateSellerReturn(req: Request, res: Response, next: NextFunction) {
    try {
        const ret = await ReturnRequest.findById(req.params.id);
        if (!ret) return next(new AppError(404, 'NOT_FOUND', 'Return request not found.'));
        if (String(ret.seller) !== req.user!.id) return next(new AppError(403, 'FORBIDDEN', 'Access denied.'));

        ret.status = req.body.status || ret.status;
        if (req.body.sellerNotes) ret.sellerNotes = req.body.sellerNotes;

        // Update timeline
        const stepMap: Record<string, string> = {
            approved: 'Seller Approved',
            pickup_scheduled: 'Pickup Scheduled',
            picked_up: 'Package Picked Up',
            inspecting: 'Inspection in Progress',
            refund_processed: 'Refund Processed',
        };
        const stepLabel = stepMap[req.body.status];
        if (stepLabel) {
            const entry = ret.timeline.find((t: any) => t.step === stepLabel);
            if (entry) (entry as any).completedAt = new Date();
        }

        await ret.save();
        res.json(ret);
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/feedback — reviews for seller's products
export async function getSellerFeedback(req: Request, res: Response, next: NextFunction) {
    try {
        // Get seller's product IDs first
        const { Product } = await import('../models/Product');
        const products = await Product.find({ seller: req.user!.id }).select('_id');
        const productIds = products.map((p: any) => p._id);
        const reviews = await Review.find({ product: { $in: productIds } }).sort({ createdAt: -1 });
        res.json({ reviews });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/market — B2B Market Insights for Sellers
export async function getMarketInsights(req: Request, res: Response, next: NextFunction) {
    try {
        const { Product } = await import('../models/Product');
        const { query } = req.query;

        // Query all active products on the platform, populate seller name
        let filter: any = { status: 'active' };

        // Search
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ];
        }

        const products = await Product.find(filter)
            .populate('seller', 'name email companyName')
            .sort({ createdAt: -1 }) // Default sort
            .lean();

        // For deep insights, we need to artificially inject mock sales/rating data 
        // if no real orders/reviews exist for the demo
        const enrichedProducts = await Promise.all(products.map(async (p: any) => {
            const orders = await Order.countDocuments({ "items.productId": p._id });
            const reviewAgg = await Review.aggregate([
                { $match: { product: p._id } },
                { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
            ]);

            const stats = reviewAgg[0] || { avgRating: 0, count: 0 };

            // To make market insights useful even on a fresh DB, inject sensible defaults if 0
            const unitsSold = orders > 0 ? orders * Math.floor(Math.random() * 3 + 1) : Math.floor(Math.random() * 500);
            const avgRating = stats.avgRating > 0 ? stats.avgRating : (Math.random() * 2 + 3).toFixed(1); // 3.0 - 5.0

            return {
                ...p,
                metrics: {
                    unitsSold,
                    reviewCount: stats.count || Math.floor(Math.random() * 100),
                    averageRating: Number(avgRating),
                    conversionRate: `${(Math.random() * 5 + 1).toFixed(1)}%`
                }
            };
        }));

        res.json({ products: enrichedProducts });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/market/:id — B2B Product Detail & Deep Analytics
export async function getMarketInsightProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { Product } = await import('../models/Product');
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name email companyName sellerProfile')
            .lean();

        if (!product) {
            return next(new AppError(404, 'NOT_FOUND', 'Product not found in market catalog.'));
        }

        // Mock historical 6-month sales trend for the chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const currentSales = Math.floor(Math.random() * 1000) + 200;
        const trend = months.map(m => ({
            month: m,
            sales: Math.max(0, currentSales + (Math.floor(Math.random() * 400) - 200))
        }));

        res.json({
            product,
            analytics: {
                unitsSold: currentSales * 6,
                averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
                reviewCount: Math.floor(Math.random() * 200) + 10,
                historicalTrend: trend,
                competitorPricing: {
                    low: Math.floor((product.price || 0) * 0.8),
                    high: Math.floor((product.price || 0) * 1.3),
                    average: Math.floor((product.price || 0) * 1.05)
                }
            }
        });
    } catch (err) {
        next(err);
    }
}
