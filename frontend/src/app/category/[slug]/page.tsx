"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Filter, ChevronDown, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const MOCK_FALLBACK_PRODUCTS = Array.from({ length: 8 }).map((_, i) => ({
    _id: `prod-${i}`,
    name: `Premium Item ${i + 1}`,
    brand: ["Gucci", "Rolex", "Sony", "Chanel"][i % 4],
    price: Math.floor(Math.random() * 100000) + 5000,
    images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400"
    ]
}));

export default function DynamicCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setIsLoading(true);
            try {
                const data = await api.get<any>(`/products?category=${slug}`);
                setProducts(data.products || []);
            } catch (error) {
                // Backend not ready — keep fallback data
                // Fallback to mock data if backend isn't ready
                setProducts(MOCK_FALLBACK_PRODUCTS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [slug]);

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
                            <span className="text-foreground font-semibold">{categoryTitle}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter">
                            {categoryTitle}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {isLoading ? "Loading collection..." : `Showing ${products.length} premium results`}
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
                            <select className="appearance-none w-full bg-background border border-border/50 rounded-xl px-6 py-3 pr-10 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-medium">
                                <option>Recommended</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest Arrivals</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">

                    {/* Filter Sidebar (Desktop) */}
                    <div className={`w-64 shrink-0 max-md:fixed max-md:inset-0 max-md:bg-background max-md:z-50 max-md:p-6 max-md:overflow-y-auto transition-transform ${isFilterOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full md:translate-x-0'}`}>
                        <div className="md:hidden flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-muted rounded-full">✕</button>
                        </div>

                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 delay-100">
                            {/* Brand Filter */}
                            <div>
                                <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-muted-foreground">Brands</h3>
                                <div className="space-y-3">
                                    {['Gucci', 'Rolex', 'Sony', 'Chanel', 'Balenciaga'].map((b, i) => (
                                        <label key={b} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border ${i === 0 ? 'bg-accent border-accent text-background' : 'border-border/50 bg-background group-hover:border-accent'} flex items-center justify-center transition-colors`}>
                                                {i === 0 && <Check className="h-3 w-3" />}
                                            </div>
                                            <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{b}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <hr className="border-border/50" />
                            {/* Price Filter */}
                            <div>
                                <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-muted-foreground">Price Range</h3>
                                <div className="space-y-4">
                                    <input type="range" min="0" max="1000000" className="w-full accent-accent" />
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm text-center">₹0</div>
                                        <span className="text-muted-foreground">-</span>
                                        <div className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm text-center">₹10L+</div>
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
                        ) : products.length === 0 ? (
                            <div className="text-center p-20 glass-panel rounded-3xl min-h-[400px] flex flex-col items-center justify-center">
                                <h3 className="text-2xl font-bold mb-2">No items found</h3>
                                <p className="text-muted-foreground">There are currently no items in this category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 delay-200">
                                {products.map((prod) => (
                                    <Link key={prod._id} href={`/products/${prod._id}`} className="group glass-panel border border-border/50 rounded-2xl overflow-hidden hover:border-accent/50 transition-all flex flex-col">
                                        <div className="aspect-[4/5] bg-muted overflow-hidden relative">
                                            <img src={prod.images?.[0] || prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <p className="text-xs text-muted-foreground font-bold tracking-wider uppercase mb-1">{prod.brand}</p>
                                            <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{prod.name}</h3>
                                            <p className="font-bold text-lg mt-auto">₹{prod.price.toLocaleString('en-IN')}</p>
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
