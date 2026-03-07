import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../../models';
import { Errors } from '../../utils/errors';
import { sendEmail } from '../../utils/sendgrid';

const SALT_ROUNDS = 10;
const resetTokenCache = new Map<string, { token: string; expiresAt: number }>();

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        if (!email) throw Errors.badRequest('Email is required.');

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // For security, do not reveal whether the user exists
            return res.json({ message: 'If an account exists, a reset link/OTP has been sent.' });
        }

        // Generate a 6-digit OTP for password reset
        const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
        resetTokenCache.set(email.toLowerCase(), {
            token: resetOtp,
            expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
        });

        const success = await sendEmail(
            email,
            'SarvaHub Password Reset',
            `Your password reset code is: ${resetOtp}. It expires in 15 minutes.`
        );

        if (!success) {
            throw Errors.internal('Failed to send password reset email.');
        }

        res.json({ message: 'If an account exists, a reset link/OTP has been sent.' });
    } catch (err) {
        next(err);
    }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            throw Errors.badRequest('Email, code, and new password are required.');
        }
        if (newPassword.length < 6) {
            throw Errors.badRequest('Password must be at least 6 characters.');
        }

        const record = resetTokenCache.get(email.toLowerCase());
        if (!record || record.token !== code || record.expiresAt < Date.now()) {
            throw Errors.unauthorized('Invalid or expired reset code.');
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) throw Errors.notFound('User not found.');

        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await user.save();
        resetTokenCache.delete(email.toLowerCase());

        res.json({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (err) {
        next(err);
    }
}
