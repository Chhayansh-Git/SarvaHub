"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Filter, ChevronDown, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface ProductItem {
    id: string;
    slug: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating?: number;
    image?: string;
    images?: string[];
    verified?: boolean;
}

interface FiltersData {
    availableCategories: string[];
    availableBrands: string[];
    priceRange: { min: number; max: number };
}

export default function DynamicCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryName, setCategoryName] = useState(slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    const [filters, setFilters] = useState<FiltersData>({ availableCategories: [], availableBrands: [], priceRange: { min: 0, max: 0 } });
    const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState('recommended');

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setIsLoading(true);
            try {
                // Fetch category details for the proper name
                try {
                    const catData = await api.get<any>('/categories');
                    const cats = catData.categories || catData || [];
                    const match = cats.find((c: any) => c.slug === slug);
                    if (match) {
                        setCategoryName(match.name);
                    }
                } catch {
                    // ignore - use formatted slug as fallback
                }

                // Fetch products with category slug filter
                const sortParam = sortBy === 'price_low' ? 'price_asc' : sortBy === 'price_high' ? 'price_desc' : sortBy === 'newest' ? 'newest' : 'recommended';
                const data = await api.get<any>(`/products?category=${slug}&sort=${sortParam}&limit=40`);
                setProducts(data.data || data.products || []);
                if (data.filters) {
                    setFilters(data.filters);
                }
            } catch (error) {
                console.error("Failed to fetch category products:", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [slug, sortBy]);

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev => {
            const next = new Set(prev);
            if (next.has(brand)) next.delete(brand);
            else next.add(brand);
            return next;
        });
    };

    const displayedProducts = selectedBrands.size > 0
        ? products.filter(p => selectedBrands.has(p.brand))
        : products;

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 pb-6 border-b border-border/50 animate-in fade-in slide-in-from-bottom-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Link href="/" className="hover:text-foreground">Home</Link>
                            <span>/</span>
                            <Link href="/categories" className="hover:text-foreground">Categories</Link>
                            <span>/</span>
                            <span className="text-foreground font-semibold">{categoryName}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter">
                            {categoryName}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {isLoading ? "Loading collection..." : `Showing ${displayedProducts.length} premium results`}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex-1 md:flex-none md:hidden flex items-center justify-center gap-2 px-6 py-3 glass-panel rounded-xl font-bold"
                        >
                            <Filter className="h-4 w-4" /> Filters
                        </button>

                        <div className="flex-1 md:flex-none relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none w-full bg-background border border-border/50 rounded-xl px-6 py-3 pr-10 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-medium"
                            >
                                <option value="recommended">Recommended</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">

                    {/* Filter Sidebar */}
                    <div className={`w-64 shrink-0 max-md:fixed max-md:inset-0 max-md:bg-background max-md:z-50 max-md:p-6 max-md:overflow-y-auto transition-transform ${isFilterOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full md:translate-x-0'}`}>
                        <div className="md:hidden flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-muted rounded-full">✕</button>
                        </div>

                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 delay-100">
                            {/* Brand Filter - Dynamic */}
                            <div>
                                <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-muted-foreground">Brands</h3>
                                <div className="space-y-3">
                                    {filters.availableBrands.length > 0 ? (
                                        filters.availableBrands.map((b) => (
                                            <label key={b} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleBrand(b)}>
                                                <div className={`w-5 h-5 rounded border ${selectedBrands.has(b) ? 'bg-accent border-accent text-background' : 'border-border/50 bg-background group-hover:border-accent'} flex items-center justify-center transition-colors`}>
                                                    {selectedBrands.has(b) && <Check className="h-3 w-3" />}
                                                </div>
                                                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{b}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Loading brands...</p>
                                    )}
                                </div>
                            </div>
                            <hr className="border-border/50" />
                            {/* Price Filter */}
                            <div>
                                <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-muted-foreground">Price Range</h3>
                                <div className="space-y-4">
                                    <input type="range" min={filters.priceRange.min || 0} max={filters.priceRange.max || 1000000} className="w-full accent-accent" />
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm text-center">₹{(filters.priceRange.min || 0).toLocaleString('en-IN')}</div>
                                        <span className="text-muted-foreground">-</span>
                                        <div className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm text-center">₹{(filters.priceRange.max || 0).toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-20 min-h-[400px]">
                                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                            </div>
                        ) : displayedProducts.length === 0 ? (
                            <div className="text-center p-20 glass-panel rounded-3xl min-h-[400px] flex flex-col items-center justify-center">
                                <h3 className="text-2xl font-bold mb-2">No items found</h3>
                                <p className="text-muted-foreground">There are currently no items in this category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 delay-200">
                                {displayedProducts.map((prod) => (
                                    <Link key={prod.id || prod.slug} href={`/products/${prod.slug}`} className="group glass-panel border border-border/50 rounded-2xl overflow-hidden hover:border-accent/50 transition-all flex flex-col">
                                        <div className="aspect-[4/5] bg-muted overflow-hidden relative">
                                            <img src={prod.image || (prod.images && prod.images[0])} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <p className="text-xs text-muted-foreground font-bold tracking-wider uppercase mb-1">{prod.brand}</p>
                                            <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{prod.name}</h3>
                                            <div className="mt-auto">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="font-bold text-lg">₹{prod.price.toLocaleString('en-IN')}</span>
                                                    {prod.originalPrice && prod.originalPrice > prod.price && (
                                                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                            {prod.discount || Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                                                        </span>
                                                    )}
                                                </div>
                                                {prod.originalPrice && prod.originalPrice > prod.price && (
                                                    <span className="text-xs line-through text-muted-foreground font-medium">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
