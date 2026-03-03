import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getFeedback, submitFeedback, upvoteFeedback } from '../controllers/feedbackController';

const router = Router();

// Public: list feedback
router.get('/', getFeedback);

// Authenticated: submit + upvote
router.post('/', authenticate, submitFeedback);
router.post('/:id/upvote', authenticate, upvoteFeedback);

export default router;
