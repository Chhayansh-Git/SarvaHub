import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/errors';
import { sendSellerOnboardingConfirmation } from '../services/emailService';

// POST /api/v1/seller/onboarding — submit seller onboarding
export async function submitOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) return next(new AppError(404, 'NOT_FOUND', 'User not found.'));

        const { businessName, businessType, gstNumber, panNumber, registeredAddress, bankDetails, contactPerson, categories } = req.body;

        user.role = 'seller';
        user.sellerProfile = {
            businessName,
            businessType,
            gstNumber,
            panNumber,
            registeredAddress,
            bankDetails,
            contactPerson,
            categories: categories || [],
            status: 'pending_verification',
            joinedYear: new Date().getFullYear(),
        };

        await user.save();
        res.status(201).json({ message: 'Seller application submitted successfully.', sellerProfile: user.sellerProfile });

        // Fire-and-forget: send confirmation email
        sendSellerOnboardingConfirmation(user.email, businessName);
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/analytics — seller analytics
export async function getSellerAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
        const { Order } = await import('../models/Order');
        const sellerId = req.user!.id;

        const orders = await Order.find({ seller: sellerId });
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentOrders = orders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const monthlyRevenue = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        // Monthly breakdown for chart
        const monthlyData: Record<string, number> = {};
        for (const order of orders) {
            const month = new Date(order.createdAt).toISOString().slice(0, 7); // YYYY-MM
            monthlyData[month] = (monthlyData[month] || 0) + (order.total || 0);
        }

        res.json({
            totalRevenue,
            monthlyRevenue,
            totalOrders: orders.length,
            recentOrderCount: recentOrders.length,
            averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
            monthlyBreakdown: Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue })),
        });
    } catch (err) {
        next(err);
    }
}

// PATCH /api/v1/seller/settings — update seller store settings
export async function updateSellerSettings(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findById(req.user!.id);
        if (!user || !user.sellerProfile) return next(new AppError(404, 'NOT_FOUND', 'Seller profile not found.'));

        const allowed = ['businessName', 'description', 'location', 'contactEmail', 'contactPhone', 'logo'];
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                (user.sellerProfile as any)[key] = req.body[key];
            }
        }

        // Handle notification preferences
        if (req.body.notificationPreferences) {
            user.sellerProfile.notificationPreferences = {
                ...(user.sellerProfile.notificationPreferences as any)?._doc || user.sellerProfile.notificationPreferences,
                ...req.body.notificationPreferences,
            };
        }

        user.markModified('sellerProfile');
        await user.save();
        res.json({ message: 'Settings updated.', sellerProfile: user.sellerProfile });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/compliance — get compliance data
export async function getSellerCompliance(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findById(req.user!.id).select('sellerProfile.compliance sellerProfile.status sellerProfile.verified');
        if (!user || !user.sellerProfile) return next(new AppError(404, 'NOT_FOUND', 'Seller profile not found.'));
        res.json({
            status: (user.sellerProfile as any).status,
            verified: (user.sellerProfile as any).verified,
            compliance: (user.sellerProfile as any).compliance,
        });
    } catch (err) {
        next(err);
    }
}
