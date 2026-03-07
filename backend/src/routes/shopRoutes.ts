import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';
import { Order } from '../models/Order';
import { Review } from '../models/Review';
import { AppError } from '../utils/errors';

const router = Router();

// GET /api/v1/shop/:sellerId — Public seller storefront
router.get('/:sellerId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { User } = await import('../models/User');
        const { sellerId } = req.params;
        const { category } = req.query;

        // Fetch the seller's public profile
        const seller = await User.findById(sellerId)
            .select('name companyName sellerProfile createdAt')
            .lean();

        if (!seller) {
            return next(new AppError(404, 'NOT_FOUND', 'Seller not found.'));
        }

        // Build product filter — only active products from this seller
        const productFilter: any = { seller: sellerId, status: 'active' };
        if (category) {
            productFilter.category = category;
        }

        // Fetch seller's active products
        const products = await Product.find(productFilter)
            .sort({ createdAt: -1 })
            .lean();

        // Get all distinct category IDs this seller has products in
        const categoryIds = await Product.distinct('category', { seller: sellerId, status: 'active' });

        const { Category } = await import('../models/Category');
        const categoryDocs = await Category.find({ _id: { $in: categoryIds } })
            .select('_id name')
            .lean();

        const categories = categoryDocs.map((c: any) => ({
            id: c._id,
            name: c.name
        }));

        // Aggregate total units sold across all seller's products
        const sellerProductIds = products.map((p: any) => p._id);

        const totalSalesAgg = await Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.productId': { $in: sellerProductIds } } },
            { $group: { _id: null, totalSold: { $sum: '$items.quantity' } } }
        ]);
        const totalUnitsSold = totalSalesAgg[0]?.totalSold || 0;

        // Aggregate average review rating across all seller's products
        const reviewAgg = await Review.aggregate([
            { $match: { product: { $in: sellerProductIds } } },
            { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
        ]);
        const reviewStats = reviewAgg[0] || { avgRating: 0, totalReviews: 0 };

        // Count total orders containing this seller's products
        const totalOrders = await Order.countDocuments({
            'items.productId': { $in: sellerProductIds }
        });

        res.json({
            seller: {
                id: (seller as any)._id,
                name: (seller as any).name,
                companyName: (seller as any).sellerProfile?.businessName || (seller as any).companyName || (seller as any).name,
                businessName: (seller as any).sellerProfile?.businessName || (seller as any).companyName || (seller as any).name,
                logo: (seller as any).sellerProfile?.logo,
                description: (seller as any).sellerProfile?.description,
                location: (seller as any).sellerProfile?.location,
                joinedYear: (seller as any).sellerProfile?.joinedYear,
                verified: (seller as any).sellerProfile?.verified || false,
                joinedAt: (seller as any).createdAt,
                categories: (seller as any).sellerProfile?.categories || [],
            },
            metrics: {
                totalProducts: products.length,
                totalUnitsSold,
                averageRating: Number((reviewStats.avgRating || 0).toFixed(1)),
                totalReviews: reviewStats.totalReviews,
                totalOrders,
            },
            categories,
            products: products.map((p: any) => ({
                _id: p._id,
                slug: p.slug,
                name: p.name,
                brand: p.brand,
                price: p.price,
                originalPrice: p.originalPrice,
                discount: p.discount,
                rating: p.rating,
                reviewCount: p.reviewCount,
                stock: p.stock,
                category: p.category,
                images: p.images,
                totalSold: p.totalSold || 0,
            })),
        });
    } catch (err) {
        next(err);
    }
});

export default router;
