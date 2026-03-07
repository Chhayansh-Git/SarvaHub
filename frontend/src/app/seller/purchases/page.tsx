"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Package, ChevronRight, Search, Loader2, Clock, Truck, CheckCircle, AlertTriangle, ShoppingBag, ArrowUpRight, MessageSquare, XCircle } from "lucide-react";

export default function SellerPurchasesPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                // GET /orders returns orders placed BY the current user
                const data = await api.get<any>("/orders");
                const orderList = Array.isArray(data) ? data : (data.orders || []);
                setOrders(orderList);
            } catch (error) {
                console.error("Failed to load purchases:", error);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
        try {
            await api.patch(`/orders/${orderId}/cancel`, {});
            setOrders(prev => prev.map(o => {
                const oid = o._id || o.id;
                if (oid === orderId) return { ...o, status: 'cancelled', statusLabel: 'Cancelled' };
                return o;
            }));
        } catch (error: any) {
            alert(error.message || 'Failed to cancel order.');
        }
    };

    const getStatusIcon = (status: string) => {
        const s = status?.toLowerCase();
        if (s === "pending" || s === "processing" || s === "confirmed") return <Clock className="h-4 w-4 text-amber-500" />;
        if (s === "shipped") return <Truck className="h-4 w-4 text-blue-500" />;
        if (s === "delivered") return <CheckCircle className="h-4 w-4 text-emerald-500" />;
        if (s === "cancelled") return <AlertTriangle className="h-4 w-4 text-rose-500" />;
        return <Package className="h-4 w-4 text-muted-foreground" />;
    };

    const getStatusColor = (status: string) => {
        const s = status?.toLowerCase();
        if (s === "delivered") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (s === "shipped") return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        if (s === "confirmed" || s === "processing" || s === "pending") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        if (s === "cancelled") return "text-red-500 bg-red-500/10 border-red-500/20";
        return "text-muted-foreground bg-muted border-border";
    };

    const filteredOrders = orders.filter((o) => {
        const s = o.status?.toLowerCase();
        if (filter !== "all" && s !== filter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchesId = (o._id || o.id || "").toLowerCase().includes(q);
            const matchesItem = o.items?.some((item: any) => item.name?.toLowerCase().includes(q));
            return matchesId || matchesItem;
        }
        return true;
    });

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight">My Purchases</h1>
                    <p className="text-muted-foreground mt-1">Track, manage, and monitor your B2B procurement orders.</p>
                </div>
                <Link
                    href="/seller/market"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent/90 transition-colors text-sm"
                >
                    <ShoppingBag className="h-4 w-4" />
                    Browse Market
                </Link>
            </div>

            {/* Search & Filter Bar */}
            <div className="glass-panel p-4 rounded-2xl border-border/50 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Order ID or product name..."
                        className="w-full bg-muted/50 border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                    {["all", "confirmed", "shipped", "delivered", "cancelled"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors ${filter === f
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-border"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-3xl border-border/50">
                    <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No purchases found</h3>
                    <p className="text-muted-foreground mb-6">
                        {filter !== "all"
                            ? "No orders match this filter."
                            : "You haven't placed any B2B orders yet."}
                    </p>
                    {filter !== "all" ? (
                        <button onClick={() => setFilter("all")} className="text-accent font-semibold hover:underline">
                            Clear Filters
                        </button>
                    ) : (
                        <Link href="/seller/market" className="text-accent font-semibold hover:underline">
                            Browse the Market →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order._id || order.id} className="glass-panel border border-border/50 rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
                            {/* Order Header */}
                            <div className="bg-muted/30 p-4 md:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50">
                                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-0.5">Order Placed</p>
                                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-0.5">Total Amount</p>
                                        <p className="font-semibold font-mono">₹{(order.total || order.subtotal || 0).toLocaleString("en-IN")}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-0.5">Order ID</p>
                                        <p className="font-mono font-medium text-xs">{(order._id || order.id || "").substring(0, 12).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        <span className="capitalize">{order.statusLabel || order.status}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-4 md:px-6">
                                <div className="space-y-3">
                                    {(order.items || []).map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                                                <Image
                                                    src={item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"}
                                                    alt={item.name || "Product"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{(item.price || 0).toLocaleString("en-IN")}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-4 md:px-6 pb-4 flex flex-wrap gap-3 items-center justify-between">
                                <div className="flex gap-3">
                                    {order.status?.toLowerCase() === "delivered" && (
                                        <>
                                            <Link
                                                href={`/seller/purchases/${order._id || order.id}/return`}
                                                className="text-xs font-bold text-muted-foreground hover:text-accent transition-colors"
                                            >
                                                Request Return
                                            </Link>
                                            <button className="text-xs font-bold text-muted-foreground hover:text-accent transition-colors flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3" /> Raise Complaint
                                            </button>
                                        </>
                                    )}
                                    {['pending', 'confirmed', 'processing'].includes(order.status?.toLowerCase()) && (
                                        <button
                                            onClick={() => handleCancelOrder(order._id || order.id)}
                                            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                        >
                                            <XCircle className="h-3 w-3" /> Cancel Order
                                        </button>
                                    )}
                                </div>
                                <Link
                                    href={`/seller/purchases/${order._id || order.id}`}
                                    className="text-sm font-semibold text-accent flex items-center gap-1 hover:underline"
                                >
                                    View Details <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
