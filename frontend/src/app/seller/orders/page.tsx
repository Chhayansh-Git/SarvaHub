"use client";

import { PackageCheck, Truck, CheckCircle2, Clock, Search, Filter, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// Mock Fallback Orders
const MOCK_ORDERS = [
    { id: "ORD-991A", item: "Classic Trench Coat", buyer: "Jane Doe", date: "Today, 10:45 AM", amount: 185000, status: "Pending" },
    { id: "ORD-992B", item: "Leica Summilux Lens", buyer: "John Smith", date: "Yesterday", amount: 450000, status: "Packed" },
    { id: "ORD-993C", item: "Rolex Daytona", buyer: "Rahul V", date: "24 Feb 2026", amount: 2450000, status: "Shipped" },
    { id: "ORD-994D", item: "Tom Ford Oud Wood", buyer: "Sarah K", date: "21 Feb 2026", amount: 32000, status: "Delivered" },
];

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await api.get<any>('/seller/orders');
                const ordersList = Array.isArray(data) ? data : (data.orders || []);
                setOrders(ordersList.length > 0 ? ordersList : MOCK_ORDERS);
            } catch (error) {
                // Backend not ready — keep fallback data
                setOrders(MOCK_ORDERS);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOrders();
    }, []);

    const columns = [
        { title: "Pending", icon: Clock, count: orders.filter(o => o.status === "Pending").length, filter: "Pending", color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "To Pack", icon: PackageCheck, count: orders.filter(o => o.status === "Packed").length, filter: "Packed", color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "In Transit", icon: Truck, count: orders.filter(o => o.status === "Shipped").length, filter: "Shipped", color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Delivered", icon: CheckCircle2, count: orders.filter(o => o.status === "Delivered").length, filter: "Delivered", color: "text-green-500", bg: "bg-green-500/10" },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                        <PackageCheck className="h-8 w-8 text-accent" />
                        Order Fulfillment
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Process incoming orders, generate shipping labels, and track deliveries.</p>
                </div>

                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-background border border-border/50 rounded-xl hover:border-accent font-semibold text-sm transition-colors flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Export CSV
                    </button>
                    <button className="px-5 py-2.5 bg-foreground text-background font-bold rounded-xl shadow-lg hover:bg-primary transition-colors hover:-translate-y-0.5 text-sm">
                        Batch Process
                    </button>
                </div>
            </div>

            {/* View Switching & Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Buyer, or AWB..."
                        className="w-full bg-glass border border-border/50 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-sm"
                    />
                </div>
                {/* Simulated Segmented Control */}
                <div className="flex p-1 bg-muted rounded-xl shrink-0">
                    <button className="px-6 py-2 bg-background text-foreground shadow-sm rounded-lg text-sm font-bold">Board View</button>
                    <button className="px-6 py-2 text-muted-foreground hover:text-foreground rounded-lg text-sm font-bold transition-colors">List View</button>
                </div>
            </div>

            {/* Kanban Board */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-accent" />
                    <p>Loading your orders...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {columns.map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            {/* Column Header */}
                            <div className={`p-4 rounded-2xl border border-border/50 ${col.bg} backdrop-blur-md flex items-center justify-between`}>
                                <div className="flex items-center gap-2">
                                    <col.icon className={`h-5 w-5 ${col.color}`} />
                                    <h3 className="font-bold">{col.title}</h3>
                                </div>
                                <span className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-xs font-bold border border-border/50">
                                    {col.count}
                                </span>
                            </div>

                            {/* Order Cards */}
                            <div className="space-y-4">
                                {orders
                                    .filter(order => order.status === col.filter)
                                    .map(order => (
                                        <div key={order.id || order._id} className="glass-panel p-5 rounded-2xl border border-border/50 hover:border-accent/40 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground group-hover:text-foreground transition-colors">{order.id || order._id?.substring(0, 8).toUpperCase()}</span>
                                                <span className="text-xs text-muted-foreground">{order.date || new Date().toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-semibold mb-1 truncate">{order.item || (order.items?.[0]?.product?.name) || 'Unknown Item'}</h4>
                                            <p className="text-sm text-muted-foreground mb-4">Buyer: {order.buyer || order.user?.name || 'Customer'}</p>

                                            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                                                <span className="font-bold">₹{(order.amount || order.totalAmount || 0).toLocaleString('en-IN')}</span>
                                                <button className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${order.status === 'Pending' ? 'bg-foreground text-background hover:bg-primary' :
                                                    order.status === 'Packed' ? 'bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-accent-foreground' :
                                                        'bg-muted text-muted-foreground hover:bg-muted/80'
                                                    }`}>
                                                    {order.status === 'Pending' ? 'Accept Order' :
                                                        order.status === 'Packed' ? 'Ship Item' :
                                                            'View Details'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
