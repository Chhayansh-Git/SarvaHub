"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Play, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Shield, Check } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { ShareProduct } from "@/components/product/ShareProduct";
import { ReviewSection } from "@/components/product/ReviewSection";
import { useHistoryStore } from "@/store/historyStore";
import { useCartStore } from "@/store/cartStore";
import { api } from "@/lib/api";

// Fallback product data for when backend is unavailable
const FALLBACK_PRODUCT = {
    id: "prod_x8922",
    name: "Chronograph Automatic 42mm",
    brand: "Orion Watch Co.",
    price: 345000,
    rating: 4.9,
    reviews: 124,
    description: "A masterclass in horological engineering. This 42mm automatic chronograph features a custom-calibrated movement, sapphire crystal with anti-reflective coating, and a hand-stitched alligator leather strap. Water-resistant up to 100 meters and backed by a 5-year international warranty.",
    features: [
        "Automatic Self-Winding Movement",
        "Scratch-resistant Sapphire Crystal",
        "48-hour Power Reserve",
        "Water Resistant to 100m",
    ],
    images: [
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2699&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1623998021446-45cd9b269056?q=80&w=2699&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=2699&auto=format&fit=crop",
    ],
    video: "https://v.ftcdn.net/06/61/89/36/700_F_661893608_tA8bEX8bL1KkVnS1FqfEIfI6r1qGzJ5w_ST.mp4",
    colors: [
        { name: "Steel", hex: "#E2E8F0" },
        { name: "Rose Gold", hex: "#B76E79" },
        { name: "Matte Carbon", hex: "#1F2937" },
    ],
    authenticity: {
        verified: true,
        batch: "CHRN-8922A",
        origin: "Mumbai, India",
    },
    seller: {
        id: "sel_9x024k",
        name: "Mumbai Horology Pvt Ltd",
        rating: 4.9,
        reviewCount: 428,
        joinedYear: 2018,
        location: "Mumbai, MH",
        description: "An authorized dealer of premium chronographs and horological instruments. We pride ourselves on rigorous provenance tracking, concierge-level customer service, and lifetime authenticity guarantees for every timepiece in our collection."
    },
    returnPolicy: {
        type: "Conditional Return",
        window: "7 Days",
        conditions: "Must remain unworn, with all original factory seals, authenticity cards, and packaging completely intact. Subject to a 5% restocking fee due to high-value nature.",
        eligible: true
    }
};

export default function ProductDetail() {
    const params = useParams();
    const slug = params.slug as string;

    const [product, setProduct] = useState<any>(FALLBACK_PRODUCT);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
    const [addingToBag, setAddingToBag] = useState(false);

    const { isAuthenticated, openAuthModal } = useUserStore();
    const addRecentlyViewed = useHistoryStore(state => state.addRecentlyViewed);
    const addItem = useCartStore(state => state.addItem);

    // Fetch product from API
    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await api.get<any>(`/products/${slug}`);
                // Normalize API response to match our expected shape
                const normalized = {
                    ...data,
                    reviews: data.reviewCount || data.reviews || 0,
                    images: Array.isArray(data.images)
                        ? data.images.map((img: any) => typeof img === 'string' ? img : img.url)
                        : FALLBACK_PRODUCT.images,
                    colors: data.colors || FALLBACK_PRODUCT.colors,
                    authenticity: {
                        verified: data.authenticity?.verified ?? true,
                        batch: data.authenticity?.batchId || data.authenticity?.batch || "N/A",
                        origin: data.authenticity?.origin || "India",
                    },
                    seller: data.seller || FALLBACK_PRODUCT.seller,
                    returnPolicy: data.returnPolicy ? {
                        type: data.returnPolicy.type || "Conditional Return",
                        window: data.returnPolicy.windowDays ? `${data.returnPolicy.windowDays} Days` : "7 Days",
                        conditions: data.returnPolicy.conditions || "",
                        eligible: data.returnPolicy.eligible !== false,
                    } : FALLBACK_PRODUCT.returnPolicy,
                };
                setProduct(normalized);
                if (normalized.colors?.[0]) setSelectedColor(normalized.colors[0]);
            } catch {
                // Use fallback product
                setProduct(FALLBACK_PRODUCT);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    const handleAddToBag = async () => {
        if (!isAuthenticated) {
            openAuthModal('login');
            return;
        }
        setAddingToBag(true);
        try {
            await addItem(product.id, 1, selectedColor?.name);
        } catch {
            // Error is handled by store
        } finally {
            setAddingToBag(false);
        }
    };

    // Save item to Recently Viewed history
    useEffect(() => {
        if (!isLoading && product) {
            addRecentlyViewed({
                id: product.id,
                name: product.name,
                image: Array.isArray(product.images) ? product.images[0] : '',
                price: product.price
            });
        }
    }, [isLoading, product, addRecentlyViewed]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 animate-pulse">
                        <div className="w-full lg:w-1/2">
                            <div className="aspect-[4/5] rounded-3xl bg-muted" />
                        </div>
                        <div className="w-full lg:w-1/2 space-y-4">
                            <div className="h-4 w-32 bg-muted rounded" />
                            <div className="h-12 w-3/4 bg-muted rounded" />
                            <div className="h-8 w-40 bg-muted rounded" />
                            <div className="h-24 w-full bg-muted rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">

                {/* Split Screen Container */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left Column: Image Gallery (Sticky) */}
                    <div className="w-full lg:w-1/2">
                        <div className="sticky top-28 space-y-4">
                            {/* Main Image Viewport */}
                            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-3xl overflow-hidden glass-panel border-transparent bg-muted">
                                {product.authenticity.verified && (
                                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/20 shadow-xl">
                                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                        <span className="text-xs font-bold text-white tracking-wider">AUTHENTIC</span>
                                    </div>
                                )}

                                {activeImage === product.images.length ? (
                                    <video
                                        src={product.video}
                                        controls
                                        autoPlay
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Image
                                        src={product.images[activeImage]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {product.images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all ${activeImage === idx ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={img} alt="Thumbnail" fill className="object-cover" />
                                    </button>
                                ))}
                                {product.video && (
                                    <button
                                        onClick={() => setActiveImage(product.images.length)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-muted transition-all ${activeImage === product.images.length ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Play className="h-6 w-6 text-foreground" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Detail & Purchase Panel */}
                    <div className="w-full lg:w-1/2 lg:py-4">
                        {/* Header */}
                        <div className="mb-8">
                            <span className="text-sm font-bold text-accent uppercase tracking-wider mb-2 block">{product.brand}</span>
                            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4">{product.name}</h1>
                            <p className="text-3xl font-mono font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Attributes Selector */}
                        <div className="mb-10 space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-sm">Select Color</span>
                                    <span className="text-muted-foreground text-sm">{selectedColor.name}</span>
                                </div>
                                <div className="flex gap-4">
                                    {product.colors.map((color: any) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color)}
                                            className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedColor.name === color.name ? 'ring-2 ring-accent ring-offset-4 ring-offset-background scale-110' : 'hover:scale-105 hover:ring-2 hover:ring-border hover:ring-offset-2 hover:ring-offset-background'
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button
                                onClick={handleAddToBag}
                                className="flex-1 py-4 px-8 bg-foreground text-background font-bold text-lg rounded-full flex items-center justify-center gap-3 hover:bg-primary transition-colors hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                Add to Bag
                            </button>
                            <button className="py-4 px-6 glass-panel border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors hover:text-accent group">
                                <Heart className="h-6 w-6 group-hover:fill-accent transition-colors" />
                            </button>
                        </div>

                        {/* Share via QR & Social Layer */}
                        <div className="mb-12 py-6 border-y border-border/50">
                            <h4 className="text-sm font-semibold mb-4">Share this masterpiece</h4>
                            <ShareProduct productUrl={typeof window !== 'undefined' ? window.location.href : 'https://sarvahub.com/products/cx-auto-42'} productName={product.name} />
                        </div>

                        {/* Guarantees */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                            <div className="flex items-start gap-4 p-4 glass-panel rounded-2xl border-glass-border">
                                <Truck className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-sm">Free Express Shipping</p>
                                    <p className="text-xs text-muted-foreground mt-1">Delivered in 2-3 business days securely.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 glass-panel rounded-2xl border-glass-border">
                                <RotateCcw className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-sm">Seller Return Policy: {product.returnPolicy.window}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{product.returnPolicy.type}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 glass-panel rounded-2xl border-glass-border">
                                <Shield className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-sm">Lifetime Authenticity</p>
                                    <p className="text-xs text-muted-foreground mt-1">100% provenance tracked on platform.</p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Seller Profile (New addition) */}
                        <div className="mb-12 p-6 glass-panel-light rounded-2xl border-border/50 relative overflow-hidden group">
                            {/* Subtle background decoration */}
                            <div className="absolute -right-12 -top-12 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <h4 className="font-heading font-bold text-lg">Sold by</h4>
                                <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Verified Partner
                                </div>
                            </div>

                            <div className="flex items-start gap-4 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-muted border border-border overflow-hidden shrink-0 relative">
                                    <Image src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=200" alt="Seller Storefront" fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-lg mb-1">{product.seller.name}</h5>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1 font-medium text-foreground">
                                            <span className="text-yellow-500">★</span> {product.seller.rating} <span className="text-muted-foreground">({product.seller.reviewCount} reviews)</span>
                                        </span>
                                        <span>•</span>
                                        <span>Since {product.seller.joinedYear}</span>
                                        <span>•</span>
                                        <span>Ships from {product.seller.location}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                                        {product.seller.description}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <button className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:bg-primary transition-colors">
                                            Visit Store
                                        </button>
                                        <button className="text-sm font-medium glass-panel px-4 py-2 rounded-lg hover:text-accent transition-colors">
                                            Contact Seller
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Accordion List (Features & Details) */}
                    <div className="space-y-4">
                        <details className="group glass-panel rounded-2xl transition-all open:ring-1 open:ring-border">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5">
                                <span>Product Features</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9" /></svg>
                                </span>
                            </summary>
                            <div className="text-muted-foreground px-5 pb-5">
                                <ul className="list-disc pl-5 space-y-2">
                                    {product.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        </details>
                        <details className="group glass-panel rounded-2xl transition-all open:ring-1 open:ring-border">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5">
                                <span>Sourcing & Authenticity</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9" /></svg>
                                </span>
                            </summary>
                            <div className="text-muted-foreground px-5 pb-5 text-sm space-y-2">
                                <p><strong>Verification Batch:</strong> {product.authenticity.batch}</p>
                                <p><strong>Origin:</strong> {product.authenticity.origin}</p>
                                <p>This item has passed SarvaHub&apos;s rigorous 12-point authenticity screening. It ships directly from the authorized distributor network.</p>
                            </div>
                        </details>

                        <details className="group glass-panel rounded-2xl transition-all open:ring-1 open:ring-border">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5">
                                <span>Return & Refund Policy</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9" /></svg>
                                </span>
                            </summary>
                            <div className="text-muted-foreground px-5 pb-5 text-sm space-y-3">
                                {product.returnPolicy.eligible ? (
                                    <>
                                        <div className="flex items-center gap-2 text-emerald-500 font-semibold mb-2">
                                            <Check className="h-4 w-4" /> Eligible for {product.returnPolicy.window} Returns
                                        </div>
                                        <p><strong>Policy Type:</strong> {product.returnPolicy.type}</p>
                                        <p><strong>Conditions set by Seller:</strong> {product.returnPolicy.conditions}</p>
                                        <p className="text-xs border-t border-border/50 pt-2 mt-2">Note: Return policies are set dynamically by the seller based on product categories and guidelines. Please review before purchase.</p>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-500 font-semibold mb-2">
                                        This item is strictly non-returnable.
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>

                </div>
            </div>

            {/* Customer Reviews Section */}
            <ReviewSection />

        </div>
    );
}
