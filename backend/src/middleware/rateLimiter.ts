import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Middleware.
 *
 * Provides tiered rate limiters for different endpoint categories
 * to prevent abuse, brute-force attacks, and API billing overruns.
 */

// ─── Auth Limiter ───────────────────────────────────────────────────
// Strict: prevents brute-force login/registration attempts
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                    // 5 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many authentication attempts. Please try again after 15 minutes.',
        },
    },
});

// ─── Search Limiter ─────────────────────────────────────────────────
// Moderate: prevents AI-API billing abuse (Vision API, Embeddings)
export const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minute
    max: 20,                   // 20 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Search rate limit exceeded. Please wait a moment before trying again.',
        },
    },
});

// ─── Global API Limiter ─────────────────────────────────────────────
// Lenient: general protection against DDoS and runaway clients
export const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minute
    max: 100,                  // 100 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Rate limit exceeded. Please slow down.',
        },
    },
});

// ─── Checkout Limiter ───────────────────────────────────────────────
// Strict: prevents Stripe PaymentIntent spam and checkout abuse
export const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // 10 checkout attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many checkout attempts. Please try again after 15 minutes.',
        },
    },
});

// ─── Webhook Limiter ────────────────────────────────────────────────
// Moderate: protect webhook endpoints from being hammered
export const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minute
    max: 50,                   // 50 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Webhook rate limit exceeded.',
        },
    },
});

// ─── Content Limiters ───────────────────────────────────────────────
export const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                   // 5 uploads per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many file uploads. Please try again later.',
        },
    },
});

export const supportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,                  // 15 support requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many support requests. Please try again later.',
        },
    },
});

export const feedbackLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                  // 10 feedback submissions per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many feedback submissions. Please try again later.',
        },
    },
});

// ─── Admin Limiter ──────────────────────────────────────────────────
// Strict: protects high-value admin endpoints
export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many admin requests. Please try again later.',
        },
    },
});

// ─── Cart Limiter ───────────────────────────────────────────────────
export const cartLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many cart requests. Please try again later.',
        },
    },
});

// ─── Order Limiter ──────────────────────────────────────────────────
export const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many order requests. Please try again later.',
        },
    },
});
