import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
    getAdminStats,
    getAdminUsers,
    updateAdminUser,
    getAdminOrders,
    getAdminProducts,
    deleteAdminProduct,
    getAdminTickets,
    getAdminFeedback,
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getAdminUsers);
router.patch('/users/:id', updateAdminUser);

// Order management
router.get('/orders', getAdminOrders);

// Product management
router.get('/products', getAdminProducts);
router.delete('/products/:id', deleteAdminProduct);

// Support tickets
router.get('/tickets', getAdminTickets);

// Feedback
router.get('/feedback', getAdminFeedback);

export default router;
