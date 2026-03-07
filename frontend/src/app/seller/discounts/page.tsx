"use client";

import { useEffect, useState } from "react";
import { Tag, Search, Loader2, Save, CheckCircle2, Package } from "lucide-react";
import { api } from "@/lib/api";
import Image from "next/image";

export default function SellerDiscountsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await api.get<any[]>('/products/seller/me');
                setProducts(Array.isArray(res) ? res : []);
            } catch (error) {
                console.error("Failed to load listings", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, []);

    const handleDiscountChange = (id: string, newDiscount: number) => {
        setProducts(products.map(p => p.id === id || p._id === id ? { ...p, discount: newDiscount } : p));
    };

    const handleSave = async (product: any) => {
        const id = product.id || product._id;
        setSavingId(id);
        setSuccessId(null);
        try {
            // The user wants to change the discount %. 
            // In SarvaHub, `price` is the final selling price, and `originalPrice` is the MRP.
            // On the discount page, `basePrice` is `product.originalPrice` (or product.price if originalPrice isn't set).
            const baseOriginalPrice = product.originalPrice || product.price;
            const discountPercentage = product.discount || 0;
            const discountAmount = baseOriginalPrice * (discountPercentage / 100);
            const newFinalPrice = Math.max(0, Math.round(baseOriginalPrice - discountAmount));

            await api.put(`/products/${id}`, {
                ...product,
                price: newFinalPrice,
                originalPrice: baseOriginalPrice,
                discount: discountPercentage,
            });
            setSuccessId(id);
            setTimeout(() => setSuccessId(null), 3000);
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to update discount.");
        } finally {
            setSavingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight">Offers & Discounts</h1>
                    <p className="text-muted-foreground mt-1">Boost sales by applying special percentage discounts to your inventory.</p>
                </div>
            </div>

            {/* Content Body */}
            <div className="glass-panel p-6 rounded-2xl border-border/50">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search listings by name or brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted/50 border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-2xl">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted/50 mb-4">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">No active listings</h3>
                        <p className="text-muted-foreground mb-6">You need to create products before you can apply discounts to them.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                                <tr>
                                    <th className="px-6 py-4 font-bold rounded-tl-xl whitespace-nowrap">Product</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Base Price</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Discount %</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Final Price</th>
                                    <th className="px-6 py-4 font-bold rounded-tr-xl text-right whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {filteredProducts.map((product) => {
                                    const id = product.id || product._id;
                                    const basePrice = product.originalPrice || product.price;
                                    const discountAmount = basePrice * ((product.discount || 0) / 100);
                                    const finalPrice = Math.max(0, basePrice - discountAmount);

                                    return (
                                        <tr key={id} className="hover:bg-muted/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-12 w-12 rounded-lg bg-accent/10 overflow-hidden shrink-0 border border-border/50">
                                                        <Image src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=150&q=80'} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-sm truncate">{product.name}</h4>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{product.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-medium">₹{basePrice.toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="99"
                                                        value={product.discount || 0}
                                                        onChange={(e) => handleDiscountChange(id, parseInt(e.target.value) || 0)}
                                                        className="w-20 bg-muted border-transparent rounded-lg px-3 py-1.5 focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium"
                                                    />
                                                    <span className="text-muted-foreground">%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-emerald-500">
                                                ₹{finalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleSave(product)}
                                                    disabled={savingId === id}
                                                    className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-accent/90 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {savingId === id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : successId === id ? (
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    ) : (
                                                        <><Save className="h-4 w-4" /> Apply</>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
