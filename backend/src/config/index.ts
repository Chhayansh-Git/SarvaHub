import dotenv from 'dotenv';
dotenv.config();

// ─── Parse CORS origins (supports comma-separated list) ─────────────
function parseCorsOrigin(raw: string | undefined): string | string[] {
    const value = raw || 'http://localhost:3000';
    if (value.includes(',')) {
        return value.split(',').map((o) => o.trim()).filter(Boolean);
    }
    return value;
}

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sarvahub',
    jwt: {
        secret: process.env.JWT_SECRET || 'default_jwt_secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
    cdnBaseUrl: process.env.CDN_BASE_URL || 'https://cdn.sarvahub.com',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    revenuecat: {
        webhookSecret: process.env.REVENUECAT_WEBHOOK_SECRET || '',
    },
    googleCloud: {
        visionApiKey: process.env.GOOGLE_CLOUD_VISION_API_KEY || '',
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY || '',
        fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
} as const;

// ─── Production Startup Validation ──────────────────────────────────
if (config.nodeEnv === 'production') {
    const fatal: string[] = [];

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'default_jwt_secret') {
        fatal.push('JWT_SECRET is missing or using the insecure default.');
    }
    if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'default_refresh_secret') {
        fatal.push('JWT_REFRESH_SECRET is missing or using the insecure default.');
    }
    if (!process.env.STRIPE_SECRET_KEY) {
        fatal.push('STRIPE_SECRET_KEY is not set.');
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        fatal.push('STRIPE_WEBHOOK_SECRET is not set.');
    }
    if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL === 'http://localhost:3000') {
        fatal.push('FRONTEND_URL is not set or points to localhost.');
    }

    if (fatal.length > 0) {
        console.error('🚨 FATAL: Production environment misconfigured:');
        fatal.forEach((msg) => console.error(`   ❌ ${msg}`));
        process.exit(1);
    }
}
