"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { ProductGrid } from "@/components/search/ProductGrid";
import { SlidersHorizontal } from "lucide-react";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const imageRef = searchParams.get("imageRef");

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Search Header */}
            <div className="bg-muted/30 border-b border-border">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight mb-2">
                                {imageRef ? "Visual Search Results" : query ? `Search Results for "${query}"` : "All Products"}
                            </h1>
                            {imageRef && (
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="h-16 w-16 rounded-xl bg-accent overflow-hidden relative border-2 border-accent">
                                        <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80" alt="Reference" fill className="object-cover opacity-80" />
                                    </div>
                                    <p className="text-muted-foreground text-sm">Showing items visually similar to your upload.</p>
                                </div>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button className="lg:hidden flex items-center justify-center gap-2 w-full md:w-auto glass-panel px-6 py-3 rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters & Sort
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar - Hidden on mobile by default */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <FilterSidebar />
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <ProductGrid />
                    </main>

                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 pb-16 container mx-auto px-4"><div className="animate-pulse h-12 w-64 bg-muted rounded mb-8"></div></div>}>
            <SearchContent />
        </Suspense>
    );
}
