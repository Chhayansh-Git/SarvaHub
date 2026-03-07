"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Search, Loader2, Edit, Trash2, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function SellerListingsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // To fetch seller's own products, assuming a seller dashboard products route exists
                // or we can just fetch all products where seller = current seller.
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
                    <h1 className="text-3xl font-heading font-black tracking-tight">Your Listings</h1>
                    <p className="text-muted-foreground mt-1">Manage your exclusive inventory and product details.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/seller/listing/new" className="px-5 py-2.5 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors text-sm shadow-md flex items-center gap-2">
                        <Plus className="h-4 w-4" /> New Listing
                    </Link>
                </div>
            </div>

            {/* Content Body */}
            <div className="glass-panel p-6 rounded-2xl border-border/50">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search listings by name, brand, or SKU..."
                            className="w-full bg-muted/50 border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-2xl">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted/50 mb-4">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">No listings yet</h3>
                        <p className="text-muted-foreground mb-6">Start building your premium store by adding your first product.</p>
                        <Link href="/seller/listing/new" className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                            <Plus className="h-4 w-4" /> Create Listing
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                                <tr>
                                    <th className="px-6 py-4 font-bold rounded-tl-xl whitespace-nowrap">Product</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Price</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Stock</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Status</th>
                                    <th className="px-6 py-4 font-bold rounded-tr-xl text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {products.map((product) => (
                                    <tr key={product.id || product._id} className="hover:bg-muted/20 transition-colors group">
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
                                        <td className="px-6 py-4 font-mono font-medium">₹{(product.price / 100).toLocaleString()}{product.discount > 0 && <span className="text-xs text-rose-500 ml-2">-{product.discount}%</span>}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${product.stock > 10 ? 'bg-emerald-500/10 text-emerald-500' : product.stock > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                                                {product.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-muted-foreground hover:text-accent disabled:opacity-50 transition-colors" title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-muted-foreground hover:text-rose-500 transition-colors" title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
