"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import {
    Loader2, ShieldCheck, Package, Star, ShoppingBag, TrendingUp,
    Calendar, ArrowLeft, LayoutGrid
} from "lucide-react";

type SellerShopData = {
    seller: {
        id: string;
        name: string;
        companyName: string;
        verified: boolean;
        joinedAt: string;
    };
    metrics: {
        totalProducts: number;
        totalUnitsSold: number;
        averageRating: number;
        totalReviews: number;
        totalOrders: number;
    };
    categories: { id: string; name: string }[];
    products: {
        _id: string;
        slug: string;
        name: string;
        brand: string;
        price: number;
        originalPrice?: number;
        discount?: number;
        rating: number;
        reviewCount: number;
        stock: number;
        category: string;
        images: { url: string; alt?: string }[];
        totalSold: number;
    }[];
};

export default function SellerShopPage() {
    const params = useParams();
    const sellerId = params.id as string;
    const [data, setData] = useState<SellerShopData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("All");

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const categoryParam = activeCategory !== "All" ? `?category=${encodeURIComponent(activeCategory)}` : "";
                const res = await api.get<SellerShopData>(`/shop/${sellerId}${categoryParam}`);
                setData(res);
            } catch (error) {
                console.error("Failed to fetch seller shop", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchShop();
    }, [sellerId, activeCategory]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20 min-h-screen pt-32">
                <h1 className="text-2xl font-bold">Seller not found.</h1>
                <Link href="/" className="mt-4 text-accent hover:underline block">Return to Home</Link>
            </div>
        );
    }

    const { seller, metrics, categories, products } = data;
    const allCategories = [{ id: "All", name: "All" }, ...categories];

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">

                {/* Back Navigation */}
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Shopping
                </Link>

                {/* ─── Seller Hero Section ─────────────────────────────────── */}
                <div className="relative rounded-3xl overflow-hidden mb-10">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-accent/5" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,110,0.15),transparent_50%)]" />

                    <div className="relative p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Avatar */}
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center text-3xl md:text-4xl font-black text-accent shrink-0 shadow-lg">
                                {(seller.companyName || seller.name).charAt(0).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h1 className="text-3xl md:text-4xl font-heading font-black">{seller.companyName || seller.name}</h1>
                                    {seller.verified && (
                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                                            <ShieldCheck className="w-4 h-4" /> Verified
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Member since {new Date(seller.joinedAt).getFullYear()}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Package className="w-4 h-4" />
                                        {metrics.totalProducts} Products
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ─── Metrics Bar ─────────────────────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="glass-panel rounded-2xl p-4 text-center border border-border/50">
                                <div className="text-2xl font-black font-mono text-foreground">{metrics.totalUnitsSold.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground font-medium mt-1 flex items-center justify-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> Units Sold
                                </div>
                            </div>
                            <div className="glass-panel rounded-2xl p-4 text-center border border-border/50">
                                <div className="text-2xl font-black font-mono text-foreground flex items-center justify-center gap-1">
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    {metrics.averageRating || "N/A"}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium mt-1">Avg Rating</div>
                            </div>
                            <div className="glass-panel rounded-2xl p-4 text-center border border-border/50">
                                <div className="text-2xl font-black font-mono text-foreground">{metrics.totalReviews.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground font-medium mt-1">Customer Reviews</div>
                            </div>
                            <div className="glass-panel rounded-2xl p-4 text-center border border-border/50">
                                <div className="text-2xl font-black font-mono text-foreground">{metrics.totalOrders.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground font-medium mt-1 flex items-center justify-center gap-1">
                                    <ShoppingBag className="w-3 h-3" /> Orders Fulfilled
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Category Tabs ───────────────────────────────────────── */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <LayoutGrid className="w-5 h-5 text-accent" />
                        <h2 className="text-xl font-bold font-heading">Browse Catalog</h2>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {allCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${activeCategory === cat.id
                                    ? "bg-foreground text-background border-foreground shadow-lg"
                                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── Product Grid ────────────────────────────────────────── */}
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No products found</h3>
                        <p className="text-muted-foreground">This seller doesn&apos;t have any products in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const imgUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";

                            return (
                                <Link
                                    key={product._id}
                                    href={`/products/${product.slug}`}
                                    className="group glass-panel rounded-2xl overflow-hidden border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden bg-muted">
                                        <Image
                                            src={imgUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.discount && product.discount > 0 && (
                                            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                {product.discount}% OFF
                                            </span>
                                        )}
                                        {product.stock < 5 && product.stock > 0 && (
                                            <span className="absolute top-3 right-3 bg-amber-500/80 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                Only {product.stock} left
                                            </span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="p-4">
                                        <span className="text-xs font-bold text-accent uppercase tracking-wider">{product.brand}</span>
                                        <h3 className="font-bold text-sm mt-1 line-clamp-2 group-hover:text-accent transition-colors">{product.name}</h3>

                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-lg font-black font-mono">₹{product.price.toLocaleString()}</span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-sm line-through text-muted-foreground font-mono">₹{product.originalPrice.toLocaleString()}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {product.rating.toFixed(1)} ({product.reviewCount})
                                            </span>
                                            <span className="text-xs">{product.totalSold} sold</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
