import { Request, Response, NextFunction } from 'express';
import { User } from '../../models';
import { Errors } from '../../utils/errors';
import { sendSmsOtp, verifySmsOtp } from '../../utils/twilio';
import { generateOtp, sendEmail } from '../../utils/sendgrid';
import { signToken, setTokenCookie } from './index';

// Simple in-memory mock cache for Email OTPs (since SendGrid doesn't have a verify API like Twilio)
const otpCache = new Map<string, { code: string; expiresAt: number }>();

export async function sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
        const { identifier, channel } = req.body; // channel: 'sms' | 'email' // identifier: phone num or email

        if (!identifier || !channel) {
            throw Errors.badRequest('Identifier and channel are required.');
        }

        if (channel === 'sms') {
            const success = await sendSmsOtp(identifier);
            if (!success) throw Errors.internal('Failed to send SMS OTP.');
        } else if (channel === 'email') {
            const code = generateOtp();
            const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
            otpCache.set(identifier.toLowerCase(), { code, expiresAt });

            const success = await sendEmail(
                identifier,
                'Your SarvaHub Login OTP',
                `Your verification code is: ${code}. It expires in 10 minutes.`
            );

            if (!success) throw Errors.internal('Failed to send Email OTP.');
        } else {
            throw Errors.badRequest('Invalid channel.');
        }

        res.status(200).json({ message: `OTP sent to ${identifier}` });
    } catch (err) {
        next(err);
    }
}

export async function verifyOtpLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const { identifier, channel, code, role = 'consumer' } = req.body;

        if (!identifier || !channel || !code) {
            throw Errors.badRequest('Identifier, channel, and code are required.');
        }

        let isVerified = false;

        if (channel === 'sms') {
            isVerified = await verifySmsOtp(identifier, code);
        } else if (channel === 'email') {
            const record = otpCache.get(identifier.toLowerCase());
            if (record && record.code === code && record.expiresAt > Date.now()) {
                isVerified = true;
                otpCache.delete(identifier.toLowerCase()); // consume OTP
            }
        }

        if (!isVerified) {
            throw Errors.unauthorized('Invalid or expired OTP.');
        }

        // Find or Create User
        let user;
        if (channel === 'sms') {
            user = await User.findOne({ phone: identifier });
        } else {
            user = await User.findOne({ email: identifier.toLowerCase() });
        }

        if (!user) {
            // Create minimal user
            user = new User({
                name: 'New User',
                email: channel === 'email' ? identifier.toLowerCase() : `guest-${Date.now()}@sarvahub.com`,
                phone: channel === 'sms' ? identifier : undefined,
                role,
                isPhoneVerified: channel === 'sms',
                isEmailVerified: channel === 'email',
                password: Math.random().toString(36).slice(-10) + 'A1!'
            });
            await user.save();
        } else {
            // Update verification status just in case
            if (channel === 'sms') user.isPhoneVerified = true;
            if (channel === 'email') user.isEmailVerified = true;
            await user.save();
        }

        const token = signToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        setTokenCookie(res, token);
        const userData = user.toJSON();

        res.status(200).json({
            token,
            user: userData,
            message: 'Logged in successfully.'
        });

    } catch (err) {
        next(err);
    }
}
