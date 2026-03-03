"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const MOCK_WISHLIST = [
    { id: "1", name: "Classic Trench Coat", brand: "Burberry", price: 185000, inStock: true, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300" },
    { id: "2", name: "Leica M11 Rangefinder", brand: "Leica", price: 825000, inStock: false, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300" },
    { id: "3", name: "Oud Wood Eau de Parfum", brand: "Tom Ford", price: 32000, inStock: true, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=300" },
];

export default function WishlistPage() {
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    const [wishlist, setWishlist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            setIsLoading(true);
            try {
                const data = await api.get<any>('/wishlist');
                setWishlist(data.items || data.wishlist || []);
            } catch (error) {
                // Backend not ready — keep fallback data
                setWishlist(MOCK_WISHLIST);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const removeFromWishlist = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.delete(`/wishlist/${id}`);
            setWishlist(items => items.filter(item => item.id !== id && item._id !== id));
        } catch (error) {
            console.error("Failed to remove item", error);
            // Optimistic fallback
            setWishlist(items => items.filter(item => item.id !== id && item._id !== id));
        }
    }; return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/account')} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                                <Heart className="h-8 w-8 text-rose-500 fill-rose-500/20" />
                                Saved Items
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                {isLoading ? "Loading your items..." : `${wishlist.length} items in your wishlist`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="glass-panel p-16 rounded-3xl text-center border border-border/50 max-w-2xl mx-auto">
                        <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold mb-2">Your wishlist is empty</h3>
                        <p className="text-muted-foreground mb-8">Save items you love to keep track of them or buy them later.</p>
                        <Link href="/search" className="px-8 py-3 bg-foreground text-background font-bold rounded-full hover:bg-primary transition-colors">
                            Discover Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlist.map((item) => {
                            const productId = item.product?._id || item._id || item.id;
                            const image = item.product?.images?.[0] || item.image || item.product?.image;
                            const name = item.product?.name || item.name;
                            const brand = item.product?.brand || item.brand;
                            const price = item.product?.price || item.price || 0;
                            const inStock = item.product ? item.product.stock > 0 : item.inStock !== false;

                            return (
                                <div key={item.id || productId} className="group glass-panel border border-border/50 rounded-2xl overflow-hidden hover:border-accent/50 transition-all flex flex-col">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                                        <img src={image || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b'} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

                                        {/* Action Overlays */}
                                        <div className="absolute top-3 right-3">
                                            <button
                                                onClick={(e) => removeFromWishlist(item.id || productId, e)}
                                                className="p-2 bg-background/80 backdrop-blur-md rounded-full text-muted-foreground hover:text-red-500 transition-colors shadow-sm"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {!inStock && (
                                            <div className="absolute inset-x-0 bottom-0 bg-background/80 backdrop-blur-md py-2 text-center text-xs font-bold tracking-wider text-muted-foreground uppercase border-t border-border/50">
                                                Out of Stock
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <p className="text-xs text-muted-foreground font-bold tracking-wider uppercase mb-1">{brand}</p>
                                        <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{name}</h3>
                                        <p className="font-bold text-lg mb-4 mt-auto">₹{price.toLocaleString('en-IN')}</p>

                                        <button
                                            disabled={!inStock}
                                            className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${inStock
                                                ? "bg-primary text-primary-foreground hover:bg-foreground hover:text-background"
                                                : "bg-muted text-muted-foreground cursor-not-allowed"
                                                }`}
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            {inStock ? "Move to Bag" : "Notify Me"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
