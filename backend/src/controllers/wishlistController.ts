import { Request, Response, NextFunction } from 'express';
import { WishlistItem } from '../models/Wishlist';
import { AppError } from '../utils/errors';

// GET /api/v1/wishlist
export async function getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
        const items = await WishlistItem.find({ user: req.user!.id }).sort({ addedAt: -1 });
        res.json({ items });
    } catch (err) {
        next(err);
    }
}

// POST /api/v1/wishlist
export async function addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
        const { productId, name, brand, price, image, slug } = req.body;
        const existing = await WishlistItem.findOne({ user: req.user!.id, productId });
        if (existing) return res.json(existing);

        const item = await WishlistItem.create({
            user: req.user!.id,
            productId,
            name: name || '',
            brand: brand || '',
            price: price || 0,
            image: image || '',
            slug: slug || '',
        });
        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
}

// DELETE /api/v1/wishlist/:id
export async function removeFromWishlist(req: Request, res: Response, next: NextFunction) {
    try {
        const item = await WishlistItem.findOneAndDelete({ _id: req.params.id, user: req.user!.id });
        if (!item) return next(new AppError(404, 'NOT_FOUND', 'Wishlist item not found.'));
        res.json({ message: 'Removed from wishlist.' });
    } catch (err) {
        next(err);
    }
}
