import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
    submitOnboarding,
    createOnboardingPayment,
    confirmOnboardingPayment,
    getSellerProducts,
    getSellerAnalytics,
    updateSellerSettings,
    getSellerCompliance,
} from '../controllers/sellerController';
import {
    getSellerOrders,
    getSellerStats,
    getSellerReturns,
    updateSellerReturn,
    getSellerFeedback,
    getMarketInsights,
    getMarketInsightProduct,
} from '../controllers/orderController';

const router = Router();

router.use(authenticate);

// Onboarding (any authenticated user can apply)
router.post('/onboarding', submitOnboarding);
router.post('/onboarding/pay', createOnboardingPayment);
router.post('/onboarding/confirm', confirmOnboardingPayment);

// Seller-only routes
router.get('/products', authorize('seller'), getSellerProducts);
router.get('/analytics', authorize('seller'), getSellerAnalytics);
router.patch('/settings', authorize('seller'), updateSellerSettings);
router.get('/compliance', authorize('seller'), getSellerCompliance);

// Market Insights & B2B
router.get('/market', authorize('seller'), getMarketInsights);
router.get('/market/:id', authorize('seller'), getMarketInsightProduct);

// Seller order management (frontend calls /seller/orders, /seller/stats, etc.)
router.get('/orders', authorize('seller'), getSellerOrders);
router.get('/stats', authorize('seller'), getSellerStats);
router.get('/returns', authorize('seller'), getSellerReturns);
router.patch('/returns/:id', authorize('seller'), updateSellerReturn);
router.get('/feedback', authorize('seller'), getSellerFeedback);
// Also accept POST /seller/products → forward to product creation
router.post('/products', authorize('seller'), async (req, res, next) => {
    const { createProduct } = await import('../controllers/productController');
    return createProduct(req, res, next);
});

export default router;
