import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    getPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
} from '../controllers/userController';

const router = Router();

router.use(authenticate);

// GET /api/v1/payments/methods
router.get('/methods', getPaymentMethods);

// POST /api/v1/payments/methods
router.post('/methods', addPaymentMethod);

// DELETE /api/v1/payments/methods/:id
router.delete('/methods/:id', deletePaymentMethod);

export default router;
