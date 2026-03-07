import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { Review } from '../models/Review';
import { ReturnRequest } from '../models/ReturnRequest';
import { User } from '../models/User';
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

// GET /api/v1/orders/returns — get current user's returns
export async function getUserReturns(req: Request, res: Response, next: NextFunction) {
    try {
        const returns = await ReturnRequest.find({ user: req.user!.id })
            .populate('order', 'itemCount total createdAt')
            .sort({ createdAt: -1 });
        res.json({ returns });
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

        // Enrich products with real metrics from DB
        const enrichedProducts = await Promise.all(products.map(async (p: any) => {
            // Real units sold: sum quantities from all orders containing this product
            const salesAgg = await Order.aggregate([
                { $unwind: '$items' },
                { $match: { 'items.productId': p._id } },
                { $group: { _id: null, totalSold: { $sum: '$items.quantity' } } }
            ]);
            const unitsSold = salesAgg[0]?.totalSold || p.totalSold || 0;

            // Real review metrics
            const reviewAgg = await Review.aggregate([
                { $match: { product: p._id } },
                { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
            ]);
            const stats = reviewAgg[0] || { avgRating: 0, count: 0 };

            return {
                ...p,
                metrics: {
                    unitsSold,
                    reviewCount: stats.count,
                    averageRating: Number((stats.avgRating || 0).toFixed(1)),
                    conversionRate: '0%' // Requires analytics tracking to compute; placeholder
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
        const query = {
            $or: [
                { _id: req.params.id },
                { slug: req.params.id }
            ]
        };

        const product = await Product.findOne(query)
            .populate('seller', 'name email companyName sellerProfile')
            .lean();

        if (!product) {
            return next(new AppError(404, 'NOT_FOUND', 'Product not found in market catalog.'));
        }

        // Real historical 6-month sales trend from Orders
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlySales = await Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.productId': (product as any)._id, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    sales: { $sum: '$items.quantity' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Build a full 6-month array with month labels, backfilling zeros
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const historicalTrend: { month: string; sales: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const found = monthlySales.find((m: any) => m._id === key);
            historicalTrend.push({ month: monthNames[d.getMonth()], sales: found?.sales || 0 });
        }

        // Real total units sold
        const totalSalesAgg = await Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.productId': (product as any)._id } },
            { $group: { _id: null, totalSold: { $sum: '$items.quantity' } } }
        ]);
        const unitsSold = totalSalesAgg[0]?.totalSold || (product as any).totalSold || 0;

        // Real review metrics
        const reviewAgg = await Review.aggregate([
            { $match: { product: (product as any)._id } },
            { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]);
        const reviewStats = reviewAgg[0] || { avgRating: 0, count: 0 };

        // Deterministic competitor pricing based on actual product price
        const price = (product as any).price || 0;
        const competitorPricing = {
            low: Math.floor(price * 0.85),
            high: Math.floor(price * 1.25),
            average: Math.floor(price * 1.05)
        };

        res.json({
            product,
            analytics: {
                unitsSold,
                averageRating: (reviewStats.avgRating || 0).toFixed(1),
                reviewCount: reviewStats.count,
                historicalTrend,
                competitorPricing
            }
        });
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/orders/b2b — authorize a B2B purchase using vendor credit/funds
export async function createB2bOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { Product } = await import('../models/Product');
        const { productId, quantity, shippingAddress, requireVerification } = req.body;

        // --- OTP Verification Check ---
        if (requireVerification) {
            const { User } = await import('../models/User'); // Import User model here
            const user = await User.findById(req.user!.id);
            if (!user?.isEmailVerified && !user?.isPhoneVerified) {
                return next(new AppError(403, 'VERIFICATION_REQUIRED', 'Please verify your phone or email before placing this order.'));
            }
        }

        if (!productId || !quantity || quantity < 1) {
            return next(new AppError(400, 'BAD_REQUEST', 'Valid product ID and quantity are required.'));
        }

        const product = await Product.findById(productId);
        if (!product) return next(new AppError(404, 'NOT_FOUND', 'Product not found.'));

        if ((product.stock ?? 0) < quantity) {
            return next(new AppError(400, 'BAD_REQUEST', 'Insufficient stock available.'));
        }

        const price = product.price || 0;
        const subtotal = price * quantity;

        // Amazon-style commission: 10% platform fee
        const platformFee = Math.round(subtotal * 0.10);
        const sellerEarnings = subtotal - platformFee;

        const order = await Order.create({
            user: req.user!.id,
            seller: [String(product.seller)],
            status: 'confirmed',
            statusLabel: 'Confirmed',
            items: [{
                productId: product.id,
                name: product.name,
                price: price,
                quantity: quantity,
                image: typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0] as any)?.url || '',
                sku: product.sku || '',
            }],
            subtotal,
            shipping: 0,
            tax: 0,
            total: subtotal,
            platformFee,
            sellerEarnings,
            payoutStatus: 'pending',
            shippingAddress: shippingAddress || {
                line1: 'B2B Default Warehouse',
                city: 'Local',
                state: 'State',
                pincode: '000000',
            },
            paymentMethod: {
                type: 'netbanking',
                brand: 'B2B Credit Line'
            }
        });

        // Deduct stock immediately
        product.stock = Math.max(0, (product.stock ?? 0) - quantity);
        await product.save();

        res.status(201).json({ message: 'B2B order authorized successfully.', order });
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/orders/:id/cancel — cancel an order (buyer only, before shipment)
export async function cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return next(new AppError(404, 'NOT_FOUND', 'Order not found.'));

        // Only the buyer who placed the order can cancel it
        if (String(order.user) !== String(req.user!.id)) {
            return next(new AppError(403, 'FORBIDDEN', 'You can only cancel your own orders.'));
        }

        const cancellableStatuses = ['pending', 'confirmed', 'processing'];
        if (!cancellableStatuses.includes(order.status?.toLowerCase())) {
            return next(new AppError(400, 'BAD_REQUEST', `Cannot cancel an order with status "${order.status}". Only pending, confirmed, or processing orders can be cancelled.`));
        }

        order.status = 'cancelled';
        order.statusLabel = 'Cancelled';
        await order.save();

        // Restore product stock
        try {
            const { Product } = await import('../models/Product');
            for (const item of order.items || []) {
                if (item.productId) {
                    await Product.findByIdAndUpdate(item.productId, {
                        $inc: { stock: item.quantity || 0 }
                    });
                }
            }
        } catch (stockErr) {
            console.error('Failed to restore stock after cancellation:', stockErr);
        }

        res.json({ message: 'Order cancelled successfully.', order });
    } catch (err) {
        next(err);
    }
}
