import { PipelineStage } from 'mongoose';
import { escapeRegex } from './escapeRegex';
import { SearchCache } from '../models/SearchCache';
import { generateEmbedding } from '../services/embeddingService';
import { Category } from '../models/Category';

/**
 * Query parameters matching the GET /products contract.
 */
export interface ProductQueryParams {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    rating?: string | number;
    verified?: string | boolean;
    sort?: string;
    page?: string | number;
    limit?: string | number;
    imageRef?: string;
}

/**
 * Builds the MongoDB aggregation pipeline for GET /products.
 *
 * Supports three search modes:
 * 1. imageRef — looks up cached product IDs from a visual search and filters by them
 * 2. q (text) — uses Atlas $vectorSearch when available, falls back to $regex
 * 3. No query — standard filter/sort/paginate
 *
 * Returns a $facet pipeline that produces:
 * - data[]: paginated product list (projected to the contract's list shape)
 * - totalCount: total matching documents
 * - filters: { availableCategories, availableBrands, priceRange }
 */
export async function buildProductFilterPipeline(query: ProductQueryParams) {
    const page = Math.max(1, parseInt(String(query.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '20'), 10)));
    const skip = (page - 1) * limit;

    // ── $match stage ────────────────────────────────────────────────
    const matchStage: Record<string, any> = {
        status: 'active',
    };

    // ── ImageRef: lookup cached product IDs from visual search ───────
    if (query.imageRef) {
        const cached = await SearchCache.findById(query.imageRef).lean();
        if (cached && cached.productIds.length > 0) {
            matchStage._id = { $in: cached.productIds };
        }
        // If cache miss or empty, imageRef is ignored — returns normal results
    }

    // ── Vector Search: when query.q is present ──────────────────────
    // Try $vectorSearch first, fall back to $regex
    let useVectorSearch = false;
    let vectorStage: PipelineStage | null = null;

    if (query.q && !query.imageRef && process.env.ENABLE_VECTOR_SEARCH === 'true') {
        try {
            const embedding = await generateEmbedding(query.q);

            // Build the filter for $vectorSearch (subset of matchStage fields)
            const vectorFilter: Record<string, any> = { status: 'active' };
            if (query.category) {
                const catDoc = await Category.findOne({
                    $or: [
                        { slug: query.category },
                        { name: { $regex: `^${escapeRegex(query.category)}$`, $options: 'i' } }
                    ]
                }).lean();
                vectorFilter.category = catDoc ? catDoc._id : query.category;
            }
            if (query.verified === true || query.verified === 'true') {
                vectorFilter['authenticity.verified'] = true;
            }

            vectorStage = {
                $vectorSearch: {
                    index: 'product_search_index',
                    path: 'searchEmbedding',
                    queryVector: embedding,
                    numCandidates: limit * 10,
                    limit: limit * 5, // Over-fetch for facet calculation
                    filter: vectorFilter,
                },
            } as any;

            useVectorSearch = true;
        } catch {
            // Vector search unavailable — fall through to regex
        }
    }

    // ── Regex fallback for text search ───────────────────────────────
    if (query.q && !useVectorSearch) {
        const escapedQ = escapeRegex(query.q);
        matchStage.$or = [
            { name: { $regex: escapedQ, $options: 'i' } },
            { brand: { $regex: escapedQ, $options: 'i' } },
            { description: { $regex: escapedQ, $options: 'i' } },
        ];
    }

    // Category filter (resolve name → _id since products store category as an ID reference)
    if (query.category && !useVectorSearch) {
        const cat = await Category.findOne({
            $or: [
                { slug: query.category },
                { name: { $regex: `^${escapeRegex(query.category)}$`, $options: 'i' } }
            ]
        }).lean();
        if (cat) {
            matchStage.category = cat._id;
        } else {
            // Fallback: treat as direct ID match
            matchStage.category = query.category;
        }
    }

    // Brand filter
    if (query.brand) {
        matchStage.brand = { $regex: `^${escapeRegex(query.brand)}$`, $options: 'i' };
    }

    // Price range (paisa integers)
    if (query.minPrice || query.maxPrice) {
        matchStage.price = {};
        if (query.minPrice) {
            matchStage.price.$gte = parseInt(String(query.minPrice), 10);
        }
        if (query.maxPrice) {
            matchStage.price.$lte = parseInt(String(query.maxPrice), 10);
        }
    }

    // Minimum rating
    if (query.rating) {
        matchStage.rating = { $gte: parseFloat(String(query.rating)) };
    }

    // Authenticity verified filter
    if (query.verified === true || query.verified === 'true') {
        matchStage['authenticity.verified'] = true;
    }

    // ── $sort stage ─────────────────────────────────────────────────
    let sortStage: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest

    switch (query.sort) {
        case 'price_asc':
            sortStage = { price: 1 };
            break;
        case 'price_desc':
            sortStage = { price: -1 };
            break;
        case 'rating':
            sortStage = { rating: -1 };
            break;
        case 'newest':
            sortStage = { createdAt: -1 };
            break;
        case 'recommended':
        default:
            // Recommended: verified first, then by rating, then newest
            sortStage = { 'authenticity.verified': -1, rating: -1, createdAt: -1 } as any;
            break;
    }

    // ── Project stage for list view (contract shape) ────────────────
    const projectStage: Record<string, any> = {
        _id: 0,
        id: '$_id',
        slug: 1,
        name: 1,
        brand: 1,
        price: 1,
        originalPrice: 1,
        rating: 1,
        reviewCount: 1,
        stock: 1,
        image: { $arrayElemAt: ['$images.url', 0] },
        verified: '$authenticity.verified',
        category: 1,
    };

    // Add vectorSearchScore if using vector search
    if (useVectorSearch) {
        projectStage.score = { $meta: 'vectorSearchScore' };
    }

    // ── Lookup category name for the response ───────────────────────
    const categoryLookupStage: PipelineStage = {
        $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: '_categoryDoc',
        },
    };

    const addCategoryNameStage: PipelineStage = {
        $addFields: {
            category: {
                $ifNull: [
                    { $arrayElemAt: ['$_categoryDoc.name', 0] },
                    '$category',
                ],
            },
        },
    };

    // ── Build the full pipeline ─────────────────────────────────────
    const pipeline: PipelineStage[] = [];

    if (useVectorSearch && vectorStage) {
        // $vectorSearch MUST be the absolute first stage
        pipeline.push(vectorStage);
        // Apply additional filters that $vectorSearch doesn't support
        if (query.brand || query.minPrice || query.maxPrice || query.rating) {
            const postVectorMatch: Record<string, any> = {};
            if (query.brand) postVectorMatch.brand = matchStage.brand;
            if (matchStage.price) postVectorMatch.price = matchStage.price;
            if (matchStage.rating) postVectorMatch.rating = matchStage.rating;
            pipeline.push({ $match: postVectorMatch });
        }
    } else {
        pipeline.push({ $match: matchStage });
    }

    pipeline.push(categoryLookupStage);
    pipeline.push(addCategoryNameStage);
    pipeline.push({
        $facet: {
            // Paginated data
            data: [
                { $sort: sortStage },
                { $skip: skip },
                { $limit: limit },
                { $project: projectStage },
            ],
            // Total count for pagination
            totalCount: [{ $count: 'count' }],
            // Dynamic filters / facets
            availableCategories: [
                { $group: { _id: '$category' } },
                { $project: { _id: 0, name: '$_id' } },
                { $sort: { name: 1 } },
            ],
            availableBrands: [
                { $group: { _id: '$brand' } },
                { $project: { _id: 0, name: '$_id' } },
                { $sort: { name: 1 } },
            ],
            priceRange: [
                {
                    $group: {
                        _id: null,
                        min: { $min: '$price' },
                        max: { $max: '$price' },
                    },
                },
                { $project: { _id: 0, min: 1, max: 1 } },
            ],
        },
    });

    return { pipeline, page, limit };
}

/**
 * Transforms the raw aggregation result into the contract response shape.
 */
export function formatProductAggregationResult(result: any[]) {
    const facets = result[0] || {};

    const data = facets.data || [];
    const totalItems = facets.totalCount?.[0]?.count || 0;

    const filters = {
        availableCategories: (facets.availableCategories || []).map((c: any) => c.name).filter(Boolean),
        availableBrands: (facets.availableBrands || []).map((b: any) => b.name).filter(Boolean),
        priceRange: facets.priceRange?.[0] || { min: 0, max: 0 },
    };

    return { data, totalItems, filters };
}

