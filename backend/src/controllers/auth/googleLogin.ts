import { Request, Response, NextFunction } from 'express';
import { User } from '../../models';
import { Errors } from '../../utils/errors';
import { verifyGoogleToken } from '../../utils/googleAuth';
import { signToken, setTokenCookie } from './index';

export async function googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            throw Errors.badRequest('Google ID Token is required.');
        }

        const payload = await verifyGoogleToken(idToken);
        if (!payload) {
            throw Errors.unauthorized('Invalid Google Token.');
        }

        const { email, name, sub: googleId } = payload;

        // Find user by email OR googleId
        let user = await User.findOne({
            $or: [{ googleId }, { email: email?.toLowerCase() }]
        });

        if (user) {
            // Update googleId if they logged in with email before
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create a new consumer user
            user = new User({
                name: name || 'Google User',
                email: email?.toLowerCase(),
                googleId,
                role: 'consumer',
                isEmailVerified: true, // Trusted by Google
                password: Math.random().toString(36).slice(-10) + 'A1!' // Random dummy password
            });
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
            message: 'Logged in with Google successfully.'
        });
    } catch (err) {
        next(err);
    }
}
