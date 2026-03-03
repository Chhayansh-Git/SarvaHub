"use client";

import Link from "next/link";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// Mock Fallback Data
const FALLBACK_ITEMS = [
    { _id: "feat-1", name: "BeoPlay A9 Gen 4", brand: "Bang & Olufsen", category: "Audio", price: 295000, images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800"] },
    { _id: "feat-2", name: "Le Chiquito Mini Bag", brand: "Jacquemus", category: "Fashion", price: 58000, images: ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800"] },
    { _id: "feat-3", name: "Oyster Perpetual 36", brand: "Rolex", category: "Watches", price: 540000, images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"] },
    { _id: "feat-4", name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", category: "Fragrance", price: 34500, images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800"] },
];

export default function FeaturedPage() {
    const [featuredItems, setFeaturedItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            setIsLoading(true);
            try {
                // Fetch products (could filter by featured or highest price/rating in real scenario)
                const data = await api.get<any>('/products?limit=8');
                setFeaturedItems(data.products || FALLBACK_ITEMS);
            } catch {
                // Backend not ready — keep fallback data
                setFeaturedItems(FALLBACK_ITEMS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Hero Header */}
                <div className="relative rounded-[2.5rem] overflow-hidden mb-16 h-[400px] md:h-[500px] flex items-center justify-center text-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    <div className="relative z-10 p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-background font-bold text-xs tracking-widest uppercase mb-6">Editor's Picks</span>
                        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-white mb-6">
                            The Featured Edit
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                            Hand-selected pieces that define modern luxury. Rare finds, timeless classics, and the season's most coveted items.
                        </p>
                    </div>
                </div>

                {/* Featured Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-12 w-12 text-accent animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-in fade-in slide-in-from-bottom-8 delay-100">
                        {featuredItems.map((item, idx) => (
                            <Link
                                href={`/products/${item._id}`}
                                key={item._id || item.id}
                                className="group"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <div className="glass-panel border border-border/50 rounded-3xl overflow-hidden hover:border-accent/40 transition-colors h-full flex flex-col">
                                    <div className="relative aspect-square overflow-hidden bg-muted">
                                        <img src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Star className="h-3 w-3 text-accent fill-accent" /> Featured
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-2">{item.brand}</p>
                                        <h3 className="text-xl font-bold mb-4 line-clamp-1">{item.name}</h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <p className="font-bold text-lg">₹{item.price.toLocaleString('en-IN')}</p>
                                            <div className="p-3 rounded-full bg-foreground text-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Editorial Callout */}
                <div className="glass-panel border border-border/50 rounded-[2.5rem] p-12 text-center max-w-4xl mx-auto">
                    <h3 className="text-3xl font-heading font-bold mb-4">Want priority access?</h3>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        SarvaHub Elite members get 24-hour early access to featured drops and exclusive collaborations.
                    </p>
                    <button className="px-8 py-4 bg-accent text-accent-foreground font-bold tracking-wider uppercase rounded-full hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                        Join Elite Membership
                    </button>
                </div>

            </div>
        </div>
    );
}
