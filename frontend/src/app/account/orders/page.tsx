"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowLeft, RefreshCcw, Star, ChevronRight, MapPin, Search, Loader2 } from "lucide-react";

export default function MyOrdersPage() {
    const { isAuthenticated } = useUserStore();
    const router = useRouter();
    const [filter, setFilter] = useState('all');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        async function fetchOrders() {
            try {
                const { api } = await import('@/lib/api');
                const data = await api.get<any>('/orders');

                // Assuming data is an array of orders or { orders: any[] }
                setOrders(Array.isArray(data) ? data : (data.orders || []));
            } catch (error) {
                // Fallback to empty state if backend fails
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOrders();
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const filteredOrders = orders.filter(o => {
        if (filter === 'all') return true;
        if (filter === 'processing') return o.status === 'Processing';
        if (filter === 'delivered') return o.status === 'Delivered';
        if (filter === 'cancelled') return o.status === 'Cancelled';
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Processing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-muted-foreground bg-muted border-border';
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header & Breadcrumbs */}
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/account" className="hover:text-foreground transition-colors">Account</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">My Orders</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">Order History</h1>
                            <p className="text-muted-foreground mt-1">Track, manage, and return your purchases.</p>
                        </div>

                        {/* Search Orders */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search all orders..."
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex overflow-x-auto gap-2 pb-4 mb-6 custom-scrollbar animate-in fade-in slide-in-from-bottom-8 duration-500 delay-75">
                    {['all', 'processing', 'delivered', 'cancelled'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-colors ${filter === f
                                ? 'bg-foreground text-background'
                                : 'bg-muted text-muted-foreground hover:bg-border'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="py-20 text-center text-muted-foreground animate-pulse">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
                        Loading orders...
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="py-20 text-center glass-panel rounded-3xl border-border/50">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">No orders found</h3>
                        <p className="text-muted-foreground mb-6">You haven&apos;t placed any orders matching this filter.</p>
                        <button onClick={() => setFilter('all')} className="text-accent font-semibold hover:underline">Clear Filters</button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-500 delay-150">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="glass-panel border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:border-accent/30 transition-colors">

                                {/* Order Header */}
                                <div className="bg-muted/30 p-5 md:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50">
                                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                                        <div>
                                            <p className="text-muted-foreground mb-0.5">Order Placed</p>
                                            <p className="font-semibold">{order.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-0.5">Total Amount</p>
                                            <p className="font-semibold">₹{order.total.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-0.5">Order ID</p>
                                            <p className="font-mono font-medium">{order.id}</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-semibold border border-border bg-background px-4 py-2 rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
                                        View Invoice
                                    </button>
                                </div>

                                {/* Order Status Bar */}
                                <div className="p-5 md:px-6 border-b border-border/50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                            {order.status}
                                        </div>
                                        <p className="text-sm font-medium">
                                            {order.status === 'Delivered' ? `Delivered on ${order.deliveredOn}` : `Estimated delivery: ${order.estimatedDelivery}`}
                                        </p>
                                    </div>
                                    <Link href={`/account/orders/${order.id}`} className="text-sm font-semibold text-accent flex items-center gap-1 hover:underline">
                                        Order Details <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                {/* Order Items Display List */}
                                <div className="p-5 md:px-6">
                                    <div className="space-y-4">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0 py-1 flex flex-col">
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.brand}</p>
                                                    <h4 className="font-semibold text-base truncate mb-1 pr-4">{item.name}</h4>
                                                    <p className="text-sm text-muted-foreground mb-auto">Qty: {item.quantity}</p>

                                                    {order.status === 'Delivered' && (
                                                        <div className="flex gap-4 mt-2">
                                                            <button className="text-xs font-semibold hover:text-accent transition-colors">Return Item</button>
                                                            <button className="text-xs font-semibold hover:text-accent transition-colors">Write Review</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
