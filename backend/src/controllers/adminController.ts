import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { SupportTicket } from '../models/SupportTicket';
import { Feedback } from '../models/Feedback';
import { AppError } from '../utils/errors';

// GET /api/v1/admin/stats — dashboard overview
export async function getAdminStats(req: Request, res: Response, next: NextFunction) {
    try {
        const [userCount, sellerCount, orderCount, productCount, ticketCount] = await Promise.all([
            User.countDocuments({ role: 'consumer' }),
            User.countDocuments({ role: 'seller' }),
            Order.countDocuments(),
            Product.countDocuments(),
            SupportTicket.countDocuments({ status: 'open' }),
        ]);

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .lean();

        const totalRevenue = await Order.aggregate([
            { $match: { 'payment.status': 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        res.json({
            users: userCount,
            sellers: sellerCount,
            orders: orderCount,
            products: productCount,
            openTickets: ticketCount,
            totalRevenue: totalRevenue[0]?.total || 0,
            recentOrders,
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/admin/users — list all users
export async function getAdminUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const role = req.query.role as string;

        const filter: any = {};
        if (role) filter.role = role;

        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments(filter),
        ]);

        res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
}

// PATCH /api/v1/admin/users/:id — update user role or status
export async function updateAdminUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { role, isBanned } = req.body;
        const update: any = {};
        const ALLOWED_ROLES = ['consumer', 'seller', 'admin'];
        if (role) {
            if (!ALLOWED_ROLES.includes(role)) {
                return next(new AppError(400, 'BAD_REQUEST', `Invalid role. Allowed: ${ALLOWED_ROLES.join(', ')}`));
            }
            update.role = role;
        }
        if (typeof isBanned === 'boolean') update.isBanned = isBanned;

        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
        if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
        res.json({ user });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/admin/orders — list all orders
export async function getAdminOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const [orders, total] = await Promise.all([
            Order.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('user', 'name email')
                .lean(),
            Order.countDocuments(),
        ]);

        res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/admin/products — list all products
export async function getAdminProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const [products, total] = await Promise.all([
            Product.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('seller', 'name email')
                .lean(),
            Product.countDocuments(),
        ]);

        res.json({ products, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
}

// DELETE /api/v1/admin/products/:id — remove a product
export async function deleteAdminProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/admin/tickets — list support tickets
export async function getAdminTickets(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const [tickets, total] = await Promise.all([
            SupportTicket.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('userId', 'name email')
                .lean(),
            SupportTicket.countDocuments()
        ]);
        res.json({ tickets, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/admin/feedback — list all feedback
export async function getAdminFeedback(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const [feedback, total] = await Promise.all([
            Feedback.find()
                .sort({ upvotes: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('authorId', 'name email')
                .lean(),
            Feedback.countDocuments()
        ]);
        res.json({ feedback, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
}
