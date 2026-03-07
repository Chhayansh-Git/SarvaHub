import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
    getUserOrders,
    getOrderById,
    updateOrderTracking,
    submitReview,
    submitReturn,
    getSellerOrders,
    getSellerStats,
    getSellerReturns,
    updateSellerReturn,
    getSellerFeedback,
    createB2bOrder,
    getUserReturns,
} from '../controllers/orderController';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// ─── Consumer Order Routes ──────────────────────────────────────────
router.get('/', getUserOrders);
router.get('/returns', getUserReturns);
router.get('/:id', getOrderById);
router.post('/b2b', createB2bOrder);
router.post('/:id/review', submitReview);
router.post('/:id/return', submitReturn);

// ─── Seller Order Routes ────────────────────────────────────────────
router.get('/seller/me', authorize('seller'), getSellerOrders);
router.get('/seller/stats', authorize('seller'), getSellerStats);
router.get('/seller/returns', authorize('seller'), getSellerReturns);
router.patch('/seller/returns/:id', authorize('seller'), updateSellerReturn);
router.get('/seller/feedback', authorize('seller'), getSellerFeedback);
router.patch('/:id/tracking', authorize('seller'), updateOrderTracking);

export default router;
