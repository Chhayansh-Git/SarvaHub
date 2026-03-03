"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart, ShieldCheck } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────

export interface ProductCard {
    id: string;
    slug?: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount?: number;
    reviews?: number;
    image: string;
    verified: boolean;
    category?: string;
}

interface ProductGridProps {
    products: ProductCard[];
    isLoading?: boolean;
    totalItems?: number;
    sort?: string;
    onSortChange?: (sort: string) => void;
}

// ─── Loading Skeleton ───────────────────────────────────────────────

function ProductSkeleton() {
    return (
        <div className="flex flex-col glass-card border-transparent animate-pulse">
            <div className="aspect-[4/5] w-full rounded-t-2xl bg-muted" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-5 w-full bg-muted rounded" />
                <div className="h-6 w-24 bg-muted rounded" />
            </div>
        </div>
    );
}

// ─── Component ──────────────────────────────────────────────────────

export function ProductGrid({ products, isLoading, totalItems, sort, onSortChange }: ProductGridProps) {
    const displayCount = totalItems ?? products.length;

    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                    {isLoading ? 'Searching...' : `${displayCount} product${displayCount !== 1 ? 's' : ''} found`}
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Sort by:</span>
                    <select
                        className="bg-transparent border-none text-foreground font-semibold outline-none cursor-pointer"
                        value={sort || 'recommended'}
                        onChange={(e) => onSortChange?.(e.target.value)}
                    >
                        <option value="recommended">Recommended</option>
                        <option value="newest">Newest Arrivals</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                ) : products.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-bold mb-2">No products found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <Link
                            href={`/products/${product.slug || product.id}`}
                            key={product.id}
                            className="group flex flex-col glass-card border-transparent hover:border-glass-border"
                        >
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-muted">
                                {product.verified && (
                                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/20 shadow-xl">
                                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                        <span className="text-xs font-bold text-white tracking-wider">AUTHENTIC</span>
                                    </div>
                                )}
                                <button
                                    onClick={(e) => { e.preventDefault(); }}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full glass-panel hover:bg-white/20 transition-colors text-white"
                                >
                                    <Heart className="h-5 w-5" />
                                </button>

                                <Image
                                    src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 bg-gradient-to-t from-black/80 to-transparent">
                                    <button
                                        onClick={(e) => { e.preventDefault(); }}
                                        className="w-full py-3 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">{product.brand}</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                        <span className="text-sm font-medium">{product.rating}</span>
                                        <span className="text-xs text-muted-foreground">({product.reviewCount || product.reviews || 0})</span>
                                    </div>
                                </div>
                                <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">{product.name}</h3>
                                <div className="mt-auto pt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-bold font-mono">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </p>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <p className="text-sm text-muted-foreground line-through">
                                                ₹{product.originalPrice.toLocaleString('en-IN')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
