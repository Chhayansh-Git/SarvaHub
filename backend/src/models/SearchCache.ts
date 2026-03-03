import mongoose, { Schema, Model } from 'mongoose';
import { generateId } from '../utils/generateId';

/**
 * SearchCache Model.
 *
 * Stores the product IDs returned by a visual or semantic search
 * so that the frontend can paginate and apply additional filters
 * without re-running the expensive AI API calls.
 *
 * Entries auto-expire after 1 hour via a TTL index on `createdAt`.
 */

export interface ISearchCache {
    _id: string;
    productIds: string[];
    labels: Array<{ description: string; score: number }>;
    searchType: 'visual' | 'semantic';
    createdAt: Date;
}

const SearchCacheLabelSchema = new Schema(
    {
        description: { type: String, required: true },
        score: { type: Number, required: true },
    },
    { _id: false }
);

const SearchCacheSchema = new Schema(
    {
        _id: { type: String, default: () => generateId('vsr') },
        productIds: [{ type: String }],
        labels: { type: [SearchCacheLabelSchema], default: [] },
        searchType: {
            type: String,
            enum: ['visual', 'semantic'],
            required: true,
        },
    },
    {
        timestamps: true, // adds createdAt + updatedAt
        toJSON: {
            virtuals: true,
            transform(_doc: any, ret: any) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// ─── TTL Index: auto-delete after 1 hour ────────────────────────────
SearchCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export const SearchCache: Model<ISearchCache> = mongoose.model<ISearchCache>(
    'SearchCache',
    SearchCacheSchema as any
);
