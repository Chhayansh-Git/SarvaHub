"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { ProductGrid, type ProductCard } from "@/components/search/ProductGrid";
import { SlidersHorizontal } from "lucide-react";
import { api } from "@/lib/api";
import { useHistoryStore } from "@/store/historyStore";

// ─── Types ──────────────────────────────────────────────────────────

interface ProductsApiResponse {
    data: ProductCard[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
    };
    filters?: {
        availableCategories?: string[];
        availableBrands?: string[];
        priceRange?: { min: number; max: number };
    };
}

// ─── Search Content ─────────────────────────────────────────────────

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addSearchKeyword } = useHistoryStore();

    const query = searchParams.get("q") || "";
    const imageRef = searchParams.get("imageRef") || "";
    const categoryParam = searchParams.get("category") || "";
    const sortParam = searchParams.get("sort") || "recommended";
    const pageParam = parseInt(searchParams.get("page") || "1", 10);

    const [products, setProducts] = useState<ProductCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<ProductsApiResponse['filters']>();
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();

    // Track search keywords
    useEffect(() => {
        if (query) addSearchKeyword(query);
    }, [query, addSearchKeyword]);

    // Build URL and fetch
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (imageRef) params.set("imageRef", imageRef);
            if (categoryParam) params.set("category", categoryParam);
            if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));
            if (selectedRating) params.set("rating", String(selectedRating));
            if (maxPrice) params.set("maxPrice", String(maxPrice));
            if (sortParam && sortParam !== "recommended") params.set("sort", sortParam);
            params.set("page", String(pageParam));
            params.set("limit", "20");

            console.log("Fetching products with params:", params.toString());
            const data = await api.get<ProductsApiResponse>(`/products?${params.toString()}`);
            console.log("API Response:", data);

            setProducts(data.data || []);
            setTotalItems(data.pagination?.totalItems || 0);
            setTotalPages(data.pagination?.totalPages || 1);
            if (data.filters) setFilters(data.filters);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [query, imageRef, categoryParam, sortParam, pageParam, selectedBrands, selectedRating, maxPrice]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // URL update helper
    const updateSearchParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        }
        // Reset to page 1 on filter changes (but not when updating page itself)
        if (!updates.page && Object.keys(updates).some(k => k !== 'page')) {
            params.set("page", "1");
        }
        router.push(`/search?${params.toString()}`);
    };

    // Sync URL params with local state on mount and when URL changes
    useEffect(() => {
        // Update brand state from URL if present
        if (categoryParam) {
            // Category is handled separately
        }
        // This will refetch with updated URL params
    }, [categoryParam]);

    const clearSearchAndGoHome = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Search Header */}
            <div className="bg-muted/30 border-b border-border">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight mb-2">
                                {imageRef ? "Visual Search Results" : query ? `Search Results for "${query}"` : "All Products"}
                            </h1>
                            {imageRef && (
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="h-16 w-16 rounded-xl bg-accent overflow-hidden relative border-2 border-accent">
                                        <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80" alt="Reference" fill className="object-cover opacity-80" />
                                    </div>
                                    <p className="text-muted-foreground text-sm">Showing items visually similar to your upload.</p>
                                </div>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button className="lg:hidden flex items-center justify-center gap-2 w-full md:w-auto glass-panel px-6 py-3 rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters & Sort
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <FilterSidebar
                            filters={filters}
                            selectedCategory={categoryParam || "All Products"}
                            selectedBrands={selectedBrands}
                            selectedRating={selectedRating}
                            maxPrice={maxPrice}
                            onCategoryChange={(cat) => updateSearchParams({ category: cat || null })}
                            onBrandToggle={(brand) => {
                                setSelectedBrands(prev =>
                                    prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                                );
                            }}
                            onRatingChange={(r) => setSelectedRating(r ?? undefined)}
                            onPriceChange={(p) => setMaxPrice(p)}
                            onClearAll={() => {
                                setSelectedBrands([]);
                                setSelectedRating(undefined);
                                setMaxPrice(undefined);
                                updateSearchParams({ category: null, sort: null, q: null });
                            }}
                        />
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <ProductGrid
                            products={products}
                            isLoading={isLoading}
                            totalItems={totalItems}
                            sort={sortParam}
                            onSortChange={(sort) => updateSearchParams({ sort })}
                            onClearSearch={clearSearchAndGoHome}
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-12">
                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => updateSearchParams({ page: String(page) })}
                                            className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${page === pageParam
                                                ? 'bg-accent text-accent-foreground'
                                                : 'glass-panel hover:bg-muted'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}

// ─── Page Wrapper ───────────────────────────────────────────────────

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 pb-16 container mx-auto px-4"><div className="animate-pulse h-12 w-64 bg-muted rounded mb-8"></div></div>}>
            <SearchContent />
        </Suspense>
    );
}
