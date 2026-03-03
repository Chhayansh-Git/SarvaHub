import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getTickets, createTicket, getTicketById } from '../controllers/supportController';

const router = Router();

router.use(authenticate);

router.get('/tickets', getTickets);
router.post('/tickets', createTicket);
router.get('/tickets/:id', getTicketById);

export default router;
