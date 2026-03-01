"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowLeft, RefreshCcw, Star, ChevronRight, MapPin } from "lucide-react";

// Mock Order Data
const mockOrders = [
    {
        id: "ORD-98234-A",
        date: "2026-02-28",
        status: "In Transit",
        total: 124500,
        items: [
            { id: 1, name: "Submariner Date 41mm", brand: "Rolex", price: 1245000, quantity: 1, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=300" }
        ]
    },
    {
        id: "ORD-77612-B",
        date: "2026-02-15",
        status: "Delivered",
        total: 45000,
        items: [
            { id: 2, name: "AirPods Max - Silver", brand: "Apple", price: 45000, quantity: 1, image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=300" }
        ]
    }
];

export default function MyOrdersPage() {
    const { isAuthenticated } = useUserStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("All");

    useEffect(() => {
        if (!isAuthenticated) router.push('/');
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const filteredOrders = activeTab === "All"
        ? mockOrders
        : mockOrders.filter(o => o.status === activeTab);

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.push('/account')} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                            <Package className="h-8 w-8 text-accent" />
                            My Orders
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">Track packages, initiate returns, or leave feedback</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {["All", "In Transit", "Delivered", "Cancelled"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab
                                    ? "bg-foreground text-background shadow-md"
                                    : "bg-muted/50 text-foreground hover:bg-muted"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="glass-panel p-12 rounded-2xl text-center border border-border/50">
                            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-lg font-bold">No orders found</h3>
                            <p className="text-muted-foreground text-sm mb-6">You haven't placed any orders that match this filter.</p>
                            <Link href="/search" className="px-6 py-2.5 bg-foreground text-background font-bold rounded-full hover:bg-primary transition-colors text-sm">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div key={order.id} className="glass-panel border border-border/50 rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
                                {/* Order Header */}
                                <div className="bg-muted/30 p-5 flex flex-wrap items-center justify-between gap-4 border-b border-border/50">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Order Placed</p>
                                            <p className="text-sm font-medium">{order.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total</p>
                                            <p className="text-sm font-medium">₹{order.total.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Order # {order.id}</p>
                                        <Link href={`#`} className="text-sm text-accent hover:underline font-semibold flex items-center justify-end gap-1">
                                            View Invoice <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            Status:
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                    order.status === 'In Transit' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                        'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </h3>
                                        {order.status === 'In Transit' && (
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <MapPin className="h-4 w-4" /> Arriving tomorrow by 9 PM
                                            </p>
                                        )}
                                    </div>

                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 py-4 border-t border-border/30 first:border-0 first:pt-0">
                                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-muted" />
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground font-bold tracking-wider uppercase mb-1">{item.brand}</p>
                                                <h4 className="font-semibold text-foreground mb-1">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 shrink-0">
                                                <Link href={`/products/mock-slug`} className="w-full text-center px-4 py-2 bg-foreground text-background rounded-lg text-xs font-bold hover:bg-primary transition-colors">
                                                    Buy Again
                                                </Link>
                                                {order.status === 'Delivered' && (
                                                    <Link href={`/account/orders/${order.id}/return`} className="w-full text-center px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-lg text-xs font-bold hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center gap-1">
                                                        <RefreshCcw className="h-3 w-3" /> Return
                                                    </Link>
                                                )}
                                                {order.status === 'Delivered' && (
                                                    <Link href={`/account/orders/${order.id}/feedback`} className="w-full text-center px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                                        <Star className="h-3 w-3" /> Review
                                                    </Link>
                                                )}
                                                {order.status === 'In Transit' && (
                                                    <button className="w-full text-center px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-bold transition-colors">
                                                        Track Package
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
