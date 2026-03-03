import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { AppError } from '../utils/errors';

// GET /api/v1/categories
export async function getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json({ categories });
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/categories/:slug
export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return next(new AppError(404, 'NOT_FOUND', 'Category not found.'));
        }
        res.json(category);
    } catch (err) {
        next(err);
    }
}
