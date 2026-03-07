import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { register, login, logout, getMe } from '../controllers/auth';
import { googleLogin } from '../controllers/auth/googleLogin';
import { sendOtp, verifyOtpLogin } from '../controllers/auth/otpLogin';
import { forgotPassword, resetPassword } from '../controllers/auth/passwordReset';

const router = Router();

// POST /api/v1/auth/register — Create a new account
router.post('/register', register);

// POST /api/v1/auth/login — Authenticate
router.post('/login', login);

// POST /api/v1/auth/google - Authenticate with Google
router.post('/google', googleLogin);

// POST /api/v1/auth/send-otp - Send an OTP via SMS/Email
router.post('/send-otp', sendOtp);

// POST /api/v1/auth/verify-otp - Verify OTP and login
router.post('/verify-otp', verifyOtpLogin);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', resetPassword);

// POST /api/v1/auth/logout — Clear auth cookie
router.post('/logout', logout);

// GET /api/v1/auth/me — Get current user (protected)
router.get('/me', authenticate, getMe);

export default router;
