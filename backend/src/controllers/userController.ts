import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { PaymentMethod } from '../models/PaymentMethod';
import { AppError } from '../utils/errors';
import bcrypt from 'bcryptjs';

// PATCH /api/v1/users/me — update profile
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const allowed = ['name', 'email', 'phone', 'avatar'];
        const updates: Record<string, any> = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const user = await User.findByIdAndUpdate(req.user!.id, updates, { new: true, runValidators: true });
        if (!user) return next(new AppError(404, 'NOT_FOUND', 'User not found.'));
        res.json(user);
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/users/change-password — change password
export async function changePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return next(new AppError(400, 'BAD_REQUEST', 'Current and new passions are required.'));
        }

        const user = await User.findById(req.user!.id).select('+password');
        if (!user) return next(new AppError(404, 'NOT_FOUND', 'User not found.'));

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return next(new AppError(401, 'UNAUTHORIZED', 'Incorrect current password.'));
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/users/me/notifications — get notification preferences
export async function getNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findById(req.user!.id).select('notificationPreferences');
        if (!user) return next(new AppError(404, 'NOT_FOUND', 'User not found.'));
        res.json(user.notificationPreferences);
    } catch (err) {
        next(err);
    }
}

// PATCH /api/v1/users/me/notifications — update notification preferences
export async function updateNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
        const allowed = ['orderUpdates', 'promotions', 'priceDropAlerts', 'sellerMessages', 'securityAlerts', 'newsletter'];
        const updates: Record<string, any> = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[`notificationPreferences.${key}`] = req.body[key];
        }

        const user = await User.findByIdAndUpdate(req.user!.id, updates, { new: true });
        if (!user) return next(new AppError(404, 'NOT_FOUND', 'User not found.'));
        res.json(user.notificationPreferences);
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/payments/methods — list saved payment methods
export async function getPaymentMethods(req: Request, res: Response, next: NextFunction) {
    try {
        const methods = await PaymentMethod.find({ user: req.user!.id });
        res.json({ methods });
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/payments/methods — save a payment method
export async function addPaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
        const { type, brand, last4, expiryMonth, expiryYear, cardholderName, upiId, isDefault } = req.body;

        // If setting as default, unset current default
        if (isDefault) {
            await PaymentMethod.updateMany({ user: req.user!.id }, { isDefault: false });
        }

        const method = await PaymentMethod.create({
            user: req.user!.id,
            type,
            brand,
            last4,
            expiryMonth,
            expiryYear,
            cardholderName,
            upiId,
            isDefault: isDefault || false,
        });
        res.status(201).json(method);
    } catch (err) {
        next(err);
    }
}

// DELETE /api/v1/payments/methods/:id — delete payment method
export async function deletePaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
        const method = await PaymentMethod.findOneAndDelete({ _id: req.params.id, user: req.user!.id });
        if (!method) return next(new AppError(404, 'NOT_FOUND', 'Payment method not found.'));
        res.json({ message: 'Payment method deleted.' });
    } catch (err) {
        next(err);
    }
}
