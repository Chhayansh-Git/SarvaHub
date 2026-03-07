"use client";

import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      // Fetch products independently — fallback on failure
      try {
        const productsRes = await api.get<any>('/products?limit=4&sort=rating');
        const items = productsRes?.data || productsRes?.products || [];
        if (items.length > 0) {
          setFeaturedProducts(items.slice(0, 4));
        }
      } catch {
        console.error("Failed to fetch products");
      }

      // Fetch categories independently — fallback on failure
      try {
        const categoriesRes = await api.get<any>('/categories');
        const apiCategories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes?.categories || []);
        if (apiCategories.length > 0) {
          setTrendingCategories(apiCategories.slice(0, 4).map((c: any) => ({
            name: c.title || c.name || "Category",
            image: c.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            count: c.description || '24 items'
          })));
        }
      } catch {
        console.error("Failed to fetch categories");
      }

      setIsLoading(false);
    }
    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-background to-background z-0" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/40 via-transparent to-transparent z-0" />

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4 text-center space-y-8 glass-panel-heavy max-w-4xl p-12 rounded-3xl border-t border-glass-border">
          <div className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-medium text-sm tracking-wide mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Welcome to the New Era of E-Commerce
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
            Curated Excellence.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600">
              Verified Authenticity.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            Discover a world of luxury and utility. Every product on SarvaHub is deeply tracked for provenance, ensuring you get exactly what you pay for.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
            <Link
              href="/categories"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
            >
              Explore Collection
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/seller/onboarding"
              className="w-full sm:w-auto px-8 py-4 bg-glass border border-border text-foreground rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-muted transition-all hover:scale-105 active:scale-95"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground">Trending Categories</h2>
            <p className="text-muted-foreground mt-2">Explore our most popular curated collections</p>
          </div>
          <Link href="/categories" className="hidden sm:flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingCategories.map((category) => (
            <Link href={`/search?category=${encodeURIComponent(category.name)}`} key={category.name} className="group relative h-80 rounded-2xl overflow-hidden glass-panel border-border/50 block">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-xl font-bold text-white mb-1 tracking-wide">{category.name}</h3>
                <p className="text-white/70 text-sm font-medium">{category.count}</p>
              </div>
              <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="h-5 w-5 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>


    </div>
  );
}
