"use client";

import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const FALLBACK_CATEGORIES = [
  { name: "Luxury Watches", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2980&auto=format&fit=crop", count: "124 items" },
  { name: "Premium Audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=3270&auto=format&fit=crop", count: "89 items" },
  { name: "Designer Apparel", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=3270&auto=format&fit=crop", count: "450 items" },
  { name: "Fine Leather", image: "https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=3270&auto=format&fit=crop", count: "210 items" },
];

const FALLBACK_PRODUCTS = [
  {
    _id: "1",
    name: "Classic Chronograph Automatic 42mm",
    brand: "Orion Watch Co.",
    price: 345000,
    rating: 4.9,
    reviews: 124,
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"],
  },
  {
    _id: "2",
    name: "Onyx & Gold Statement Ring",
    brand: "Aetherius",
    price: 189000,
    rating: 4.8,
    reviews: 89,
    images: ["https://images.unsplash.com/photo-1515562141207-7a48cf7ce338?auto=format&fit=crop&q=80&w=800"],
  },
  {
    _id: "3",
    name: "Signature Leather Travel Weekender",
    brand: "Vanguard",
    price: 98000,
    rating: 5.0,
    reviews: 42,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"],
  },
  {
    _id: "4",
    name: "Vintage 1960s Submariner Limited",
    brand: "Heritage Horology",
    price: 1250000,
    rating: 4.9,
    reviews: 15,
    images: ["https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=800"],
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(FALLBACK_PRODUCTS);
  const [trendingCategories, setTrendingCategories] = useState<any[]>(FALLBACK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      // Fetch products independently — fallback on failure
      try {
        const productsRes = await api.get<any>('/products?limit=4');
        if (productsRes?.products?.length > 0) {
          setFeaturedProducts(productsRes.products.slice(0, 4));
        }
      } catch {
        // Backend not ready — keep fallback products
      }

      // Fetch categories independently — fallback on failure
      try {
        const categoriesRes = await api.get<any>('/categories');
        const apiCategories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes?.categories || []);
        if (apiCategories.length > 0) {
          setTrendingCategories(apiCategories.slice(0, 4).map((c: any) => ({
            name: c.title || c.name || "Category",
            image: c.image || FALLBACK_CATEGORIES[0].image,
            count: c.description || `${Math.floor(Math.random() * 200) + 50} items`
          })));
        }
      } catch {
        // Backend not ready — keep fallback categories
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
            <Link href={`/category/${category.name.toLowerCase().replace(' ', '-')}`} key={category.name} className="group relative h-80 rounded-2xl overflow-hidden glass-panel border-border/50 block">
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

      {/* Featured Products Validation */}
      <section className="py-24 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="max-w-2xl text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start text-accent mb-4">
                <ShieldCheck className="h-6 w-6" />
                <span className="font-bold tracking-widest uppercase text-sm">Authenticity Guaranteed</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Curated Featured Selection</h2>
              <p className="text-muted-foreground text-lg">Every item in our featured collection has passed our rigorous 12-point provenance verification process.</p>
            </div>
            <Link href="/featured" className="px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors shrink-0">
              Shop Featured List
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product._id || product.id}`} key={product._id || product.id} className="group glass-panel rounded-2xl overflow-hidden flex flex-col hover:border-accent/50 transition-colors border-border/50 shadow-sm hover:shadow-xl hover:shadow-black/5">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.images?.[0] || product.image || FALLBACK_PRODUCTS[0].images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1.5 bg-black/70 backdrop-blur-md rounded border border-white/20 shadow-xl text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> AUTHENTIC
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{product.brand}</p>
                  <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>

                  <div className="flex items-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-bold">{product.rating || 4.9}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews || Math.floor(Math.random() * 200)})</span>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price</p>
                      <p className="text-xl font-bold font-heading">₹{(product.price || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
