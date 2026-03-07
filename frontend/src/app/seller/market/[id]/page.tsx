"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Loader2, ArrowLeft, TrendingUp, Star, PackageSearch, ShieldCheck, ShoppingCart, Info, CheckCircle } from "lucide-react";
import { ContactSellerDialog } from "@/components/shared/ContactSellerDialog";

type ProductDetails = {
    _id: string;
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: { url: string; alt?: string }[];
    category: string;
    seller: { name: string; companyName: string; sellerProfile?: { verified: boolean } };
};

type Analytics = {
    unitsSold: number;
    averageRating: string;
    reviewCount: number;
    historicalTrend: { month: string; sales: number }[];
    competitorPricing: { low: number; high: number; average: number };
};

export default function MarketProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get<{ product: ProductDetails; analytics: Analytics }>(`/seller/market/${params.id}`);
                setProduct(res.product);
                setAnalytics(res.analytics);
            } catch (error) {
                console.error("Failed to fetch B2B product details", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    const handleB2BOrder = () => {
        if (!product) return;
        router.push(`/seller/checkout?productId=${product._id}&qty=${quantity}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
            </div>
        );
    }

    if (!product || !analytics) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Product not found.</h1>
                <button onClick={() => router.back()} className="mt-4 text-accent hover:underline">Return to Market Insights</button>
            </div>
        );
    }

    // Find the max sales to scale the bar chart
    const maxSales = Math.max(...analytics.historicalTrend.map(t => t.sales), 1);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Market Insights
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Overview (Left Col) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start border-border/50">
                        <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-muted overflow-hidden relative border border-border">
                            <Image src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'} alt={product.name} fill className="object-cover hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold px-2.5 py-1 bg-accent/10 text-accent rounded-full uppercase tracking-wider">{product.category}</span>
                                {product.seller?.sellerProfile?.verified && (
                                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Seller
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-heading font-black mb-2">{product.name}</h1>
                            <div className="text-muted-foreground mb-6 flex items-center gap-2">
                                Sold by <Link href={`/seller/store/${(product.seller as any)?._id || (product.seller as any)?.id}`} className="font-bold text-foreground hover:text-accent transition-colors hover:underline">{product.seller?.companyName || product.seller?.name}</Link>
                                <div className="flex items-center gap-2 ml-3">
                                    <Link href={`/seller/store/${(product.seller as any)?._id || (product.seller as any)?.id}`} className="text-xs font-bold bg-accent/10 text-accent px-3 py-1.5 rounded-lg hover:bg-accent hover:text-white transition-all">
                                        Visit B2B Store
                                    </Link>
                                    <ContactSellerDialog
                                        sellerId={(product.seller as any)?._id || (product.seller as any)?.id}
                                        sellerName={product.seller?.companyName || product.seller?.name}
                                        productId={product._id || product.id || ''}
                                        productName={product.name}
                                    />
                                </div>
                            </div>

                            <div className="prose prose-sm dark:prose-invert max-w-none mb-6 line-clamp-3">
                                {product.description}
                            </div>

                            <div className="flex items-end gap-3 p-4 rounded-xl bg-background/50 border border-border/50">
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground mb-1">B2B Wholesale Price</p>
                                    <div className="text-4xl font-black font-mono">₹{product.price.toLocaleString()}</div>
                                </div>
                                <div className="text-sm font-bold text-emerald-500 mb-1 ml-auto">
                                    {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historical Sales Chart */}
                    <div className="glass-panel rounded-3xl p-8 border-border/50">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-accent" />
                            <h2 className="text-2xl font-bold font-heading">Sales Trajectory (6 Months)</h2>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2 pt-10">
                            {analytics.historicalTrend.map((data, i) => {
                                const heightPercentage = (data.sales / maxSales) * 100;
                                return (
                                    <div key={i} className="flex flex-col items-center flex-1 group">
                                        <div className="w-full relative flex items-end justify-center h-full rounded-t-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                            <div
                                                className="w-1/2 rounded-t-lg bg-gradient-to-t from-accent/50 to-accent transition-all duration-700 ease-in-out group-hover:shadow-[0_0_15px_rgba(201,169,110,0.5)]"
                                                style={{ height: `${heightPercentage}%` }}
                                            />
                                            <span className="absolute -top-8 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-background px-2 py-1 rounded shadow-md border border-border">
                                                {data.sales} units
                                            </span>
                                        </div>
                                        <div className="text-xs font-bold text-muted-foreground mt-4">{data.month}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Analytics & Ordering (Right Col) */}
                <div className="space-y-6">
                    {/* B2B Ordering Card */}
                    <div className="glass-panel rounded-3xl p-6 border-border/50 border-accent/20 shadow-[0_0_30px_rgba(201,169,110,0.05)]">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-accent" /> Place B2B Order
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-sm font-bold text-muted-foreground mb-1.5 block">Quantity Required</label>
                                <div className="flex items-center bg-background rounded-xl border border-border overflow-hidden">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-muted transition-colors font-bold">-</button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full text-center bg-transparent border-none focus:ring-0 font-mono font-bold"
                                    />
                                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-muted transition-colors font-bold">+</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-3 border-y border-border/50 border-dashed">
                                <span className="font-medium text-muted-foreground">Order Total</span>
                                <span className="font-black font-mono text-xl">₹{(product.price * quantity).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleB2BOrder}
                            disabled={product.stock < 1}
                            className="w-full py-4 bg-foreground text-background font-black rounded-xl hover:bg-accent hover:text-white hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout
                        </button>

                        <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-500/10 p-3 text-xs text-blue-500">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>You will be taken to the checkout page to complete shipping and payment details.</p>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="glass-panel rounded-3xl p-6 border-border/50 space-y-4">
                        <h3 className="font-bold mb-2">Market Performance</h3>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <PackageSearch className="w-4 h-4" />
                                <span className="text-sm font-medium">Platform Volume</span>
                            </div>
                            <span className="font-bold font-mono">{analytics.unitsSold.toLocaleString()} units</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium">Customer Sentiment</span>
                            </div>
                            <span className="font-bold flex items-center gap-1">
                                {analytics.averageRating} <span className="text-xs text-muted-foreground font-normal">({analytics.reviewCount})</span>
                            </span>
                        </div>

                        <div className="p-4 rounded-xl bg-background border border-border/50 mt-4">
                            <div className="text-sm font-bold mb-3 flex items-center justify-between">
                                Competitor Pricing
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-normal text-muted-foreground">Estimate</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Low</span>
                                    <span className="font-mono">₹{analytics.competitorPricing.low}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-accent">
                                    <span>Average</span>
                                    <span className="font-mono">₹{analytics.competitorPricing.average}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">High</span>
                                    <span className="font-mono">₹{analytics.competitorPricing.high}</span>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full mt-3 relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-[20%] right-[30%] bg-accent/40 rounded-full" />
                                <div className="absolute top-0 bottom-0 w-1.5 bg-foreground rounded-full -ml-0.5" style={{ left: '45%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
