import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/errors';
import { sendSellerOnboardingConfirmation } from '../services/emailService';
import Stripe from 'stripe';
import { config } from '../config';

const stripe = config.stripe.secretKey ? new Stripe(config.stripe.secretKey) : null;

// POST /api/v1/seller/onboarding — submit seller onboarding
export async function submitOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) return next(new AppError(404, 'NOT_FOUND', 'User not found.'));

        const { businessName, businessType, gstNumber, panNumber, registeredAddress, bankDetails, contactPerson, categories } = req.body;

        // user.role = 'seller'; // DO NOT set role yet, wait for payment
        user.sellerProfile = {
            businessName,
            businessType,
            gstNumber,
            panNumber,
            registeredAddress,
            bankDetails,
            contactPerson,
            categories: categories || [],
            status: 'pending_payment',
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

// POST /api/v1/seller/onboarding/pay — create Stripe checkout session for ₹10 fee
export async function createOnboardingPayment(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findById(req.user!.id);
        if (!user || !user.sellerProfile) return next(new AppError(404, 'NOT_FOUND', 'Seller profile not found.'));
        if (user.role === 'seller') return next(new AppError(400, 'BAD_REQUEST', 'Already a seller.'));

        if (!stripe) return next(new AppError(500, 'SERVER_ERROR', 'Stripe is not configured.'));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            client_reference_id: String(user.id),
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'SarvaHub Seller Registration Fee',
                            description: 'One-time registration fee to become a seller on SarvaHub.',
                        },
                        unit_amount: 4900, // ₹49.00 (Stripe INR minimum is typically ~₹40)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${config.frontendUrl}/seller/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.frontendUrl}/seller/onboarding`,
            metadata: {
                userId: String(user.id),
                type: 'seller_onboarding'
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/seller/onboarding/confirm — verify payment and activate seller
export async function confirmOnboardingPayment(req: Request, res: Response, next: NextFunction) {
    try {
        const { session_id } = req.body;
        if (!session_id) return next(new AppError(400, 'BAD_REQUEST', 'Session ID is required.'));

        if (!stripe) return next(new AppError(500, 'SERVER_ERROR', 'Stripe is not configured.'));

        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status !== 'paid') {
            return next(new AppError(400, 'BAD_REQUEST', 'Payment not successful.'));
        }

        const userId = session.client_reference_id;
        const user = await User.findById(userId);
        if (!user || !user.sellerProfile) return next(new AppError(404, 'NOT_FOUND', 'User not found.'));

        if (user.role !== 'seller') {
            user.role = 'seller';
            user.sellerProfile.status = 'active';
            await user.save();
        }

        res.json({ message: 'Payment confirmed. You are now a seller.', role: user.role });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/seller/analytics — seller analytics
export async function getSellerAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
        const { Order } = await import('../models/Order');
        const { Product } = await import('../models/Product');
        const user = await User.findById(req.user!.id).select('sellerProfile.verified');
        const sellerId = req.user!.id;

        const orders = await Order.find({ seller: { $in: [sellerId] } });
        const activeListingsCount = await Product.countDocuments({ seller: sellerId, status: 'active' });

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

        // Dynamic Trust Score Calculation (out of 100)
        let trustScore = 50; // Base score for new sellers
        const isVerified = user?.sellerProfile?.verified || false;
        if (isVerified) trustScore += 10;

        // Volume impact: +2 points per order, max 25
        trustScore += Math.min(25, orders.length * 2);

        // Catalog impact: +1 point per active listing, max 15
        trustScore += Math.min(15, activeListingsCount);

        res.json({
            totalRevenue,
            monthlyRevenue,
            totalOrders: orders.length,
            recentOrderCount: recentOrders.length,
            averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
            monthlyBreakdown: Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue })),
            trustScore: Math.min(100, trustScore),
            isVerified
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

        const allowed = ['businessName', 'description', 'location', 'contactEmail', 'contactPhone', 'logo', 'businessType', 'gstNumber', 'panNumber'];
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                (user.sellerProfile as any)[key] = req.body[key];
            }
        }

        if (!user.sellerProfile.contactPerson) user.sellerProfile.contactPerson = {};
        if (req.body.founderName !== undefined) (user.sellerProfile.contactPerson as any).name = req.body.founderName;
        if (req.body.email !== undefined) {
            user.sellerProfile.contactEmail = req.body.email;
            (user.sellerProfile.contactPerson as any).email = req.body.email;
        }
        if (req.body.phone !== undefined) {
            user.sellerProfile.contactPhone = req.body.phone;
            (user.sellerProfile.contactPerson as any).phone = req.body.phone;
        }

        if (req.body.address !== undefined) {
            user.sellerProfile.location = req.body.address;
            if (!user.sellerProfile.registeredAddress) user.sellerProfile.registeredAddress = {};
            (user.sellerProfile.registeredAddress as any).line1 = req.body.address;
        }
        if (req.body.category !== undefined) {
            user.sellerProfile.categories = [req.body.category];
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
