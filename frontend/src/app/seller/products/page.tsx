"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Search, Filter, Plus, Edit2, Trash2, Eye, Loader2 } from "lucide-react";

export default function SellerProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSellerProducts() {
            try {
                const { api } = await import('@/lib/api');
                const data = await api.get<any>('/seller/products');

                // Assuming data is an array or { products: [] }
                const productList = Array.isArray(data) ? data : (data.products || []);

                if (productList.length > 0) {
                    setProducts(productList);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Failed to load products", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSellerProducts();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                        <Package className="h-8 w-8 text-accent" />
                        Inventory & Listings
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm text-balance">
                        Manage your products, update stock levels, and optimize your listings for maximum visibility.
                    </p>
                </div>

                <Link
                    href="/seller/listing/new"
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-bold rounded-xl shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors shrink-0"
                >
                    <Plus className="h-4 w-4" /> Add New Product
                </Link>
            </div>

            {/* Toolbar */}
            <div className="glass-panel p-4 rounded-2xl border border-border/50 flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by product name, SKU, or category..."
                        className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-accent text-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2.5 bg-background border border-border/50 rounded-xl hover:border-accent transition-colors text-sm font-semibold flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Category
                    </button>
                    <button className="px-4 py-2.5 bg-background border border-border/50 rounded-xl hover:border-accent transition-colors text-sm font-semibold flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Status
                    </button>
                </div>
            </div>

            {/* Data Table */}
            {isLoading ? (
                <div className="py-20 text-center text-muted-foreground animate-pulse">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
                    Loading inventory...
                </div>
            ) : (
                <div className="glass-panel border border-border/50 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    <th className="p-4">Product Details</th>
                                    <th className="p-4 hidden sm:table-cell">SKU</th>
                                    <th className="p-4 hidden md:table-cell">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50 text-sm">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                            <Package className="h-8 w-8 mx-auto mb-3 opacity-50" />
                                            <p className="font-medium text-lg">No products found</p>
                                            <p className="text-sm mt-1">Start building your store by adding a new product.</p>
                                        </td>
                                    </tr>
                                ) : products.map((item) => {
                                    const id = item._id || item.id;
                                    const price = item.price ? (item.price / 100) : item.sellingPrice || 0;
                                    const stock = item.stock ?? item.inventory ?? 0;
                                    const status = item.status || (stock > 0 ? 'Active' : 'Out of Stock');
                                    const displayCategory = item.category || (item.categories && item.categories[0]) || 'General';

                                    return (
                                        <tr key={id} className="hover:bg-muted/20 transition-colors">
                                            <td className="p-4">
                                                <div className="font-semibold text-foreground">{item.name}</div>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell font-mono text-xs">{item.sku || 'N/A'}</td>
                                            <td className="p-4 hidden md:table-cell text-muted-foreground capitalize">{displayCategory}</td>
                                            <td className="p-4 font-semibold">₹{price.toLocaleString('en-IN')}</td>
                                            <td className="p-4">
                                                <span className={`font-bold ${stock <= 5 && stock > 0 ? 'text-orange-500' : stock === 0 ? 'text-red-500' : 'text-foreground'}`}>
                                                    {stock}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${status.toLowerCase() === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                    status.toLowerCase().includes('low') ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                        'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    }`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="p-4 flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors" title="View Listing">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 hover:bg-muted text-muted-foreground hover:text-accent rounded-lg transition-colors" title="Edit Product">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors" title="Delete Product">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
                        <div>Showing <span className="font-bold text-foreground">1</span> to <span className="font-bold text-foreground">{products.length}</span> of <span className="font-bold text-foreground">{products.length}</span> entries</div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-border/50 rounded-lg hover:bg-muted transition-colors disabled:opacity-50" disabled>Prev</button>
                            <button className="px-3 py-1 border border-border/50 rounded-lg bg-foreground text-background font-bold transition-colors">1</button>
                            <button className="px-3 py-1 border border-border/50 rounded-lg hover:bg-muted transition-colors disabled:opacity-50" disabled>Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
