import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/errors';
import { globalLimiter, authLimiter, searchLimiter, webhookLimiter, checkoutLimiter, uploadLimiter, supportLimiter, feedbackLimiter, adminLimiter, cartLimiter, orderLimiter } from './middleware/rateLimiter';

// ─── Route Imports ──────────────────────────────────────────────────
import productRoutes from './routes/productRoutes';
import searchRoutes from './routes/searchRoutes';
import paymentRoutes from './routes/paymentRoutes';
import webhookRoutes from './routes/webhookRoutes';
import authRoutes from './routes/authRoutes';
import cartRoutes from './routes/cartRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import userRoutes from './routes/userRoutes';
import supportRoutes from './routes/supportRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import sellerRoutes from './routes/sellerRoutes';
import paymentMethodRoutes from './routes/paymentMethodRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/adminRoutes';

// ─── Create Express App ─────────────────────────────────────────────
const app = express();

// ─── Security Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(
    cors({
        origin: Array.isArray(config.corsOrigin)
            ? (origin, callback) => {
                if (!origin || (config.corsOrigin as string[]).includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
            : config.corsOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ─── Stripe Webhook (MUST be before express.json() body parser) ─────
// Stripe requires the raw body buffer for signature verification.
app.use(
    '/api/v1/webhooks/stripe',
    express.raw({ type: 'application/json' })
);

// ─── Body Parsers ───────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Global Rate Limiter ────────────────────────────────────────────
app.use(globalLimiter);

// ─── Health Check ───────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ─── API Routes ─────────────────────────────────────────────────────
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartLimiter, cartRoutes);
app.use('/api/v1/search', searchLimiter, searchRoutes);
app.use('/api/v1/checkout', checkoutLimiter, paymentRoutes);
app.use('/api/v1/webhooks', webhookLimiter, webhookRoutes);

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderLimiter, orderRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/support', supportLimiter, supportRoutes);
app.use('/api/v1/feedback', feedbackLimiter, feedbackRoutes);
app.use('/api/v1/seller', sellerRoutes);
app.use('/api/v1/payments', paymentMethodRoutes);
app.use('/api/v1/upload', uploadLimiter, uploadRoutes);
app.use('/api/v1/admin', adminLimiter, adminRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────
app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(404, 'ROUTE_NOT_FOUND', 'The requested endpoint does not exist.'));
});

// ─── Global Error Handler ───────────────────────────────────────────
app.use(errorHandler);

export default app;
