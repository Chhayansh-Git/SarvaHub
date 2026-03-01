"use client";

import Image from "next/image";
import { Star, ShoppingBag, Heart, ShieldCheck } from "lucide-react";

// Dummy data for products based on premium vibe
const products = [
    { id: 1, name: "Chronograph Automatic 42mm", brand: "Orion Watch Co.", price: 345000, rating: 4.9, reviews: 124, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2699&auto=format&fit=crop", verified: true, category: "Accessories" },
    { id: 2, name: "Noise-Cancelling Studio Pro", brand: "Acoustica", price: 34500, rating: 4.8, reviews: 89, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=3265&auto=format&fit=crop", verified: true, category: "Electronics" },
    { id: 3, name: "Italian Leather Briefcase", brand: "Milano Crafted", price: 74000, rating: 5.0, reviews: 42, image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2699&auto=format&fit=crop", verified: true, category: "Fashion" },
    { id: 4, name: "Cashmere Overcoat", brand: "Heritage Tailors", price: 105000, rating: 4.7, reviews: 215, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=3000&auto=format&fit=crop", verified: true, category: "Fashion" },
    { id: 5, name: "Minimalist Smart Speaker", brand: "Sony", price: 25000, rating: 4.6, reviews: 312, image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=3174&auto=format&fit=crop", verified: false, category: "Electronics" },
    { id: 6, name: "Matte Black Espresso Machine", brand: "Home & Design", price: 135000, rating: 4.9, reviews: 56, image: "https://images.unsplash.com/photo-1510224151-5898bc582666?q=80&w=3270&auto=format&fit=crop", verified: true, category: "Home & Design" },
];

export function ProductGrid() {
    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">{products.length} products found</p>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Sort by:</span>
                    <select className="bg-transparent border-none text-foreground font-semibold outline-none cursor-pointer">
                        <option>Recommended</option>
                        <option>Newest Arrivals</option>
                        <option>Price: High to Low</option>
                        <option>Price: Low to High</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="group flex flex-col glass-card border-transparent hover:border-glass-border">
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-muted">
                            {product.verified && (
                                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/20 shadow-xl">
                                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                    <span className="text-xs font-bold text-white tracking-wider">AUTHENTIC</span>
                                </div>
                            )}
                            <button className="absolute top-4 right-4 z-10 p-2 rounded-full glass-panel hover:bg-white/20 transition-colors text-white">
                                <Heart className="h-5 w-5" />
                            </button>

                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 bg-gradient-to-t from-black/80 to-transparent">
                                <button className="w-full py-3 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
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
                                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                                </div>
                            </div>
                            <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">{product.name}</h3>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <p className="text-xl font-bold font-mono">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
