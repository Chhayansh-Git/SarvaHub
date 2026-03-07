"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Package, Star, ShieldCheck, MapPin, Loader2, Search, Store } from "lucide-react";

export default function B2bStorefrontPage() {
    const params = useParams();
    const sellerId = params.id as string;

    const [shopData, setShopData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchShopDetails() {
            try {
                const { api } = await import('@/lib/api');
                const data = await api.get<any>(`/shop/${sellerId}`);
                setShopData(data);
            } catch (err) {
                console.error("Failed to fetch B2B storefront:", err);
            } finally {
                setIsLoading(false);
            }
        }
        if (sellerId) fetchShopDetails();
    }, [sellerId]);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground animate-pulse">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p>Loading Vendor Storefront...</p>
            </div>
        );
    }

    if (!shopData || !shopData.seller) {
        return (
            <div className="p-8 max-w-7xl mx-auto text-center py-20">
                <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Vendor Store Not Found</h2>
                <p className="text-muted-foreground">The requested vendor profile could not be loaded.</p>
            </div>
        );
    }

    const { seller, activeProducts, metrics } = shopData;

    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
            {/* Vendor Header Profile */}
            <div className="glass-panel p-8 rounded-3xl border border-border/50 flex flex-col md:flex-row gap-8 items-start mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                <div className="w-24 h-24 rounded-2xl bg-muted border border-border/50 shrink-0 flex items-center justify-center overflow-hidden relative">
                    {seller.logo ? (
                        <Image src={seller.logo} alt={seller.businessName} fill className="object-cover" />
                    ) : (
                        <span className="text-3xl font-black text-muted-foreground tracking-tighter">
                            {seller.businessName?.substring(0, 2).toUpperCase() || 'B2B'}
                        </span>
                    )}
                </div>

                <div className="flex-1 z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-heading font-black tracking-tight">{seller.businessName || 'Unnamed Vendor'}</h1>
                        {seller.verified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck className="h-3.5 w-3.5" /> Verified Vendor
                            </span>
                        )}
                    </div>
                    {(seller.location || seller.registeredAddress?.city) && (
                        <p className="text-muted-foreground flex items-center gap-1.5 mb-4 text-sm font-medium">
                            <MapPin className="h-4 w-4" /> {seller.location || seller.registeredAddress?.city + ', ' + seller.registeredAddress?.state}
                            <span className="mx-2 opacity-30">•</span>
                            Joined {seller.joinedYear || new Date().getFullYear()}
                        </p>
                    )}
                    <p className="text-foreground/80 leading-relaxed max-w-3xl">
                        {seller.description || 'Verified B2B Vendor partner on SarvaHub platform.'}
                    </p>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-auto shrink-0 z-10">
                    <div className="bg-background/50 p-4 border border-border/50 rounded-2xl">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Volume</span>
                            <span className="text-2xl font-black">{metrics.totalUnitsSold || 0}</span>
                        </div>
                    </div>
                    <div className="bg-background/50 p-4 border border-border/50 rounded-2xl">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Avg Rating</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-5 w-5 fill-current" />
                                <span className="text-2xl font-black text-foreground">{metrics.averageRating}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-background/50 p-4 border border-border/50 rounded-2xl hidden lg:block">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Active Catalog</span>
                            <span className="text-2xl font-black">{activeProducts.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catalog Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
                        <Package className="h-6 w-6 text-accent" /> B2B Catalog
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            className="bg-background border border-border/50 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-accent"
                        />
                    </div>
                </div>

                {activeProducts.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl border border-border/50 px-4">
                        <Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-bold">No Active Inventory</h3>
                        <p className="text-muted-foreground text-sm mt-1">This vendor has no public listings available for B2B procurement at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {activeProducts.map((product: any) => (
                            <div key={product._id} className="group relative bg-background border border-border/50 rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 flex flex-col h-full">
                                {/* Image */}
                                <div className="aspect-square relative bg-muted overflow-hidden">
                                    {product.images && product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                            <Package className="h-8 w-8 mb-2 opacity-50" />
                                            <span className="text-xs">No image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        <span className="px-2 py-1 bg-background/90 backdrop-blur-sm border border-border text-[10px] font-bold uppercase tracking-wider rounded text-green-600">
                                            B2B Ready
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                        <span className="bg-background text-foreground px-4 py-2 font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-heading">
                                            View Product
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                        <span>{product.category || 'General'}</span>
                                        <span className="opacity-30">•</span>
                                        <span>SKU: {product.sku || 'N/A'}</span>
                                    </div>
                                    <h3 className="font-bold text-base leading-tight mb-3 line-clamp-2 flex-1 group-hover:text-accent transition-colors">
                                        {product.name}
                                    </h3>

                                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-muted-foreground mb-0.5">Wholesale Price</div>
                                            <div className="font-heading font-black text-lg">
                                                ₹{((product.price || 0) / 100).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={`/seller/market/${product.slug || product._id}`}
                                    className="absolute inset-0 z-10"
                                    aria-label={`View ${product.name}`}
                                ></a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
