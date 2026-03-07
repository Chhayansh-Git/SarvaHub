import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    updateProfile,
    getNotificationPreferences,
    updateNotificationPreferences,
    getPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    changePassword,
} from '../controllers/userController';

const router = Router();

router.use(authenticate);

// Profile
router.patch('/me', updateProfile);
router.post('/change-password', changePassword);

// Notification preferences
router.get('/me/notifications', getNotificationPreferences);
router.patch('/me/notifications', updateNotificationPreferences);

// Payment methods
router.get('/me/payments', getPaymentMethods);
router.post('/me/payments', addPaymentMethod);
router.delete('/me/payments/:id', deletePaymentMethod);

export default router;
