import { Request, Response, NextFunction } from 'express';
import { Feedback } from '../models/Feedback';

// GET /api/v1/feedback — list feedback (public)
export async function getFeedback(req: Request, res: Response, next: NextFunction) {
    try {
        const feedback = await Feedback.find().sort({ upvotes: -1, createdAt: -1 });
        res.json({ feedback });
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/feedback — submit feedback (authenticated)
export async function submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, description } = req.body;
        const fb = await Feedback.create({
            title,
            description,
            author: req.user!.id,
            authorName: req.body.authorName || 'Community',
        });
        res.status(201).json(fb);
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/feedback/:id/upvote — upvote feedback
export async function upvoteFeedback(req: Request, res: Response, next: NextFunction) {
    try {
        const fb = await Feedback.findById(req.params.id);
        if (!fb) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Feedback not found.' } });

        const userId = req.user!.id;
        if (fb.upvotedBy.includes(userId)) {
            // Undo upvote
            fb.upvotedBy = fb.upvotedBy.filter((id: string) => id !== userId);
            fb.upvotes = Math.max(0, fb.upvotes - 1);
        } else {
            fb.upvotedBy.push(userId);
            fb.upvotes += 1;
        }
        await fb.save();
        res.json(fb);
    } catch (err) {
        next(err);
    }
}
