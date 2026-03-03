"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Tag, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    const fetchProducts = async () => {
        try {
            const data = await api.get<any>('/admin/products');
            setProducts(data.products || []);
        } catch {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;
        try {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        } catch {
            // handle error
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount / 100);
    };

    const filtered = products.filter(p => p.name?.toLowerCase().includes(filter.toLowerCase()) || p.brand?.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight">Product Catalog</h1>
                    <p className="text-muted-foreground mt-1">Manage all listings across the marketplace.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-border/50 bg-glass rounded-xl text-sm focus:outline-none focus:border-accent w-full md:w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="glass-panel rounded-3xl overflow-hidden border border-border/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground border-b border-border/50 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-5 font-semibold">Product</th>
                                    <th className="p-5 font-semibold">Price</th>
                                    <th className="p-5 font-semibold">Seller</th>
                                    <th className="p-5 font-semibold">Status</th>
                                    <th className="p-5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filtered.map(product => (
                                    <tr key={product._id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Tag className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground line-clamp-1">{product.name}</div>
                                                    <div className="text-muted-foreground text-xs">{product.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-bold">{formatCurrency(product.price)}</td>
                                        <td className="p-5 text-muted-foreground">{product.sellerId?.name || 'Unknown'}</td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${product.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete Product"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-muted-foreground">No products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
