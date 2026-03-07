"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, TrendingUp, Star, Filter, Loader2, ArrowUpRight, BarChart3, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";

type MarketProduct = {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: { url: string; alt?: string }[];
    category: string;
    seller: { _id: string; name: string; companyName: string };
    metrics: {
        unitsSold: number;
        reviewCount: number;
        averageRating: number;
        conversionRate: string;
    };
};

export default function MarketInsightsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [products, setProducts] = useState<MarketProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
    const [sortBy, setSortBy] = useState('sales'); // sales, rating, new

    useEffect(() => {
        const fetchMarketData = async () => {
            setIsLoading(true);
            try {
                const query = searchParams.get('q');
                const url = query ? `/seller/market?query=${encodeURIComponent(query)}` : `/seller/market`;
                const res = await api.get<{ products: MarketProduct[] }>(url);

                let sorted = res.products || [];
                if (sortBy === 'sales') sorted.sort((a, b) => b.metrics.unitsSold - a.metrics.unitsSold);
                if (sortBy === 'rating') sorted.sort((a, b) => b.metrics.averageRating - a.metrics.averageRating);

                setProducts(sorted);
            } catch (err) {
                console.error("Failed to fetch market insights:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMarketData();
    }, [searchParams, sortBy]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/seller/market${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-xl w-full">
                    <div className="flex items-center gap-2 text-accent mb-2">
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-bold tracking-widest uppercase text-xs">Market Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-heading font-black tracking-tight mb-2">Global Catalog Insights</h1>
                    <p className="text-muted-foreground">Analyze top-performing products across the entire platform and discover B2B opportunities.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setSortBy('sales')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${sortBy === 'sales' ? 'bg-foreground text-background' : 'glass-panel hover:bg-accent/10'}`}
                    >
                        Top Sellers
                    </button>
                    <button
                        onClick={() => setSortBy('rating')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${sortBy === 'rating' ? 'bg-foreground text-background' : 'glass-panel hover:bg-accent/10'}`}
                    >
                        Highest Rated
                    </button>
                    <button className="px-4 py-2 glass-panel rounded-xl text-sm font-bold hover:bg-accent/10 transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                </div>
            </div>

            {/* Dedicated Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search market for products, categories, or sellers..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl glass-panel border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-medium"
                />
            </form>

            {/* Data Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-accent animate-spin" />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-3xl border-border/50 border border-dashed">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No market data found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">We couldn't find any products matching your market query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="glass-panel rounded-3xl p-5 border border-border/50 flex flex-col group relative overflow-hidden transition-all hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5">
                            <div className="flex gap-4 mb-4 relative z-10">
                                <div className="w-24 h-24 rounded-2xl bg-muted overflow-hidden relative shrink-0">
                                    <Image
                                        src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-accent mb-1">{product.category}</div>
                                    <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
                                    <div className="text-sm text-muted-foreground line-clamp-1">by {product.seller?.companyName || product.seller?.name || 'Unknown Seller'}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                                <div className="bg-background/50 rounded-xl p-3 border border-border/50">
                                    <div className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1.5">
                                        <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Total Volume
                                    </div>
                                    <div className="font-mono font-bold text-lg">{product.metrics.unitsSold.toLocaleString()}</div>
                                </div>
                                <div className="bg-background/50 rounded-xl p-3 border border-border/50">
                                    <div className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Avg Rating
                                    </div>
                                    <div className="font-mono font-bold text-lg flex items-end gap-1">
                                        {product.metrics.averageRating}
                                        <span className="text-xs text-muted-foreground font-sans tracking-normal pb-0.5">({product.metrics.reviewCount})</span>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/seller/market/${product._id}`} className="mt-auto relative z-10">
                                <button className="w-full py-3 bg-muted hover:bg-accent hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn">
                                    <ShoppingCart className="w-4 h-4" />
                                    View Options & Order
                                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
