import { Request, Response, NextFunction } from 'express';
import { SupportTicket } from '../models/SupportTicket';
import { AppError } from '../utils/errors';

// GET /api/v1/support/tickets
export async function getTickets(req: Request, res: Response, next: NextFunction) {
    try {
        const tickets = await SupportTicket.find({ user: req.user!.id }).sort({ createdAt: -1 });
        res.json({ tickets });
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/support/tickets
export async function createTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { subject, category, priority, message, orderId } = req.body;

        if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
            return next(new AppError(400, 'BAD_REQUEST', 'Subject is required.'));
        }
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return next(new AppError(400, 'BAD_REQUEST', 'Message is required.'));
        }
        const ticket = await SupportTicket.create({
            user: req.user!.id,
            subject,
            category: category || 'general',
            priority: priority || 'medium',
            orderId: orderId || null,
            messages: message ? [{ sender: 'user', content: message }] : [],
        });
        res.status(201).json(ticket);
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/support/tickets/:id
export async function getTicketById(req: Request, res: Response, next: NextFunction) {
    try {
        const ticket = await SupportTicket.findOne({ _id: req.params.id, user: req.user!.id });
        if (!ticket) return next(new AppError(404, 'NOT_FOUND', 'Ticket not found.'));
        res.json(ticket);
    } catch (err) {
        next(err);
    }
}
