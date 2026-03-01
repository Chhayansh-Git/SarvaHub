"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
    {
        id: "fashion",
        title: "Fashion & Apparel",
        description: "Discover the latest trends from top designers around the globe.",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
        colSpan: "md:col-span-2",
        rowSpan: "md:row-span-2"
    },
    {
        id: "watches",
        title: "Luxury Watches",
        description: "Timeless craftsmanship and precision engineering for the modern connoisseur.",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600",
        colSpan: "col-span-1",
        rowSpan: "row-span-1"
    },
    {
        id: "electronics",
        title: "Premium Electronics",
        description: "State-of-the-art technology wrapped in beautiful design.",
        image: "https://images.unsplash.com/photo-1550009158-9effb6ce1774?auto=format&fit=crop&q=80&w=600",
        colSpan: "col-span-1",
        rowSpan: "row-span-1"
    },
    {
        id: "beauty",
        title: "Beauty & Wellness",
        description: "Curated skincare and fragrances to elevate your daily routine.",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200",
        colSpan: "md:col-span-2",
        rowSpan: "row-span-1"
    }
];

export default function CategoriesPage() {
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

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px] animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.id}`}
                            className={`group relative overflow-hidden rounded-3xl ${cat.colSpan} ${cat.rowSpan}`}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            {/* Category Info */}
                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {cat.title}
                                </h3>
                                <p className="text-white/80 text-sm md:text-base mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 line-clamp-2">
                                    {cat.description}
                                </p>

                                <span className="inline-flex items-center gap-2 text-white font-bold text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    Browse Collection <ArrowRight className="h-4 w-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

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
