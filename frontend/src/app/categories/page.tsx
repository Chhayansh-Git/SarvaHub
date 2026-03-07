"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const FALLBACK_CATEGORIES = [
    {
        id: "luxury-watches",
        title: "Luxury Watches",
        description: "Curated collection of Swiss and haute horlogerie timepieces",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
        colSpan: "md:col-span-2",
        rowSpan: "md:row-span-2"
    },
    {
        id: "fine-jewelry",
        title: "Fine Jewelry",
        description: "Handcrafted pieces featuring precious stones and metals",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
        colSpan: "col-span-1",
        rowSpan: "row-span-1"
    },
    {
        id: "designer-bags",
        title: "Designer Bags",
        description: "Iconic designer handbags and leather goods",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
        colSpan: "col-span-1",
        rowSpan: "row-span-1"
    },
    {
        id: "premium-audio",
        title: "Premium Audio",
        description: "High-fidelity audio equipment for audiophiles",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
        colSpan: "col-span-1",
        rowSpan: "row-span-1"
    },
    {
        id: "fragrances",
        title: "Fragrances",
        description: "Luxury perfumes and niche fragrances",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
        colSpan: "col-span-1",
        rowSpan: "row-span-1"
    },
    {
        id: "sunglasses",
        title: "Sunglasses",
        description: "Designer eyewear from top luxury brands",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
        colSpan: "col-span-1",
        rowSpan: "row-span-1"
    },
    {
        id: "luxury-pens",
        title: "Luxury Pens",
        description: "Fine writing instruments from prestigious brands",
        image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=600",
        colSpan: "col-span-1",
        rowSpan: "row-span-1"
    },
    {
        id: "home-decor",
        title: "Home Décor",
        description: "Curated luxury items for your living space",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200",
        colSpan: "md:col-span-2",
        rowSpan: "row-span-1"
    },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { api } = await import('@/lib/api');
                const data = await api.get<any>('/categories');
                const formattedList = Array.isArray(data) ? data : (data.categories || []);
                if (formattedList.length > 0) {
                    // Assign bento grid layout: first and last items span 2 columns
                    const withLayout = formattedList.map((cat: any, idx: number) => ({
                        ...cat,
                        title: cat.title || cat.name,
                        colSpan: (idx === 0 || idx === formattedList.length - 1) ? 'md:col-span-2' : 'col-span-1',
                        rowSpan: idx === 0 ? 'md:row-span-2' : 'row-span-1',
                    }));
                    setCategories(withLayout);
                } else {
                    setCategories(FALLBACK_CATEGORIES);
                }
            } catch (error) {
                setCategories(FALLBACK_CATEGORIES);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4">

                {/* Header Section */}
                <div className="max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground mb-4">
                        Explore Categories
                    </h1>
                    <p className="text-lg text-muted-foreground w-full md:w-2/3">
                        Shop our handpicked selection of premium goods across fashion, technology, and lifestyle.
                    </p>
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p>Loading categories...</p>
                    </div>
                ) : (
                    /* Bento Grid layout */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px] animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100">
                        {categories.map((cat, idx) => (
                            <Link
                                key={cat.id || idx}
                                href={`/search?category=${encodeURIComponent(cat.title || cat.name || cat.id)}`}
                                className={`group relative overflow-hidden rounded-3xl ${cat.colSpan || 'col-span-1'} ${cat.rowSpan || 'row-span-1'}`}
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${cat.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200'})` }}
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                {/* Category Info */}
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {cat.title || cat.name}
                                    </h3>
                                    {cat.description && (
                                        <p className="text-white/80 text-sm md:text-base mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 line-clamp-2">
                                            {cat.description}
                                        </p>
                                    )}

                                    <span className="inline-flex items-center gap-2 text-white font-bold text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Browse Collection <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* All Brands Ribbon */}
                <div className="mt-20 p-8 glass-panel border border-border/50 rounded-3xl text-center">
                    <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-6">Featuring World-Class Brands</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Fake Brand Logos text */}
                        <span className="text-2xl font-black tracking-tighter mix-blend-difference">BALENCIAGA</span>
                        <span className="text-2xl font-serif italic mix-blend-difference">Burberry</span>
                        <span className="text-2xl font-light tracking-[0.2em] mix-blend-difference">ROLEX</span>
                        <span className="text-2xl font-bold mix-blend-difference">SAMSUNG</span>
                        <span className="text-2xl font-black mix-blend-difference">Leica</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
