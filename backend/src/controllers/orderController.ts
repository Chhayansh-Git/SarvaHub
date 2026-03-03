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
        if (order.user !== req.user!.id && order.seller !== req.user!.id) {
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
        if (order.seller !== req.user!.id) {
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
        if (order.user !== req.user!.id) return next(new AppError(403, 'FORBIDDEN', 'Access denied.'));

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
        if (order.user !== req.user!.id) return next(new AppError(403, 'FORBIDDEN', 'Access denied.'));

        const returnRequest = await ReturnRequest.create({
            order: order._id,
            user: req.user!.id,
            seller: order.seller,
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
        const orders = await Order.find({ seller: req.user!.id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/stats — seller dashboard KPIs
export async function getSellerStats(req: Request, res: Response, next: NextFunction) {
    try {
        const sellerId = req.user!.id;
        const [totalOrders, deliveredOrders, allOrders] = await Promise.all([
            Order.countDocuments({ seller: sellerId }),
            Order.countDocuments({ seller: sellerId, status: 'delivered' }),
            Order.find({ seller: sellerId }).select('total status'),
        ]);

        const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = allOrders.filter(o => ['confirmed', 'processing', 'pending'].includes(o.status)).length;

        res.json({
            totalOrders,
            deliveredOrders,
            pendingOrders,
            totalRevenue,
            averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
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
        if (ret.seller !== req.user!.id) return next(new AppError(403, 'FORBIDDEN', 'Access denied.'));

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
