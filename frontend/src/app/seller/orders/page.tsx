"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, ArrowUpRight, Package, Clock, Truck, CheckCircle, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get<any[]>('/seller/orders');
                setOrders(Array.isArray(res) ? res : []);
            } catch (error) {
                console.error("Failed to load orders", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
            case 'processing': return <Clock className="h-4 w-4 text-amber-500" />;
            case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
            case 'delivered': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
            case 'cancelled': return <AlertTriangle className="h-4 w-4 text-rose-500" />;
            default: return <Package className="h-4 w-4 text-muted-foreground" />;
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
                    <h1 className="text-3xl font-heading font-black tracking-tight">Order Management</h1>
                    <p className="text-muted-foreground mt-1">Track and fulfill your customer orders.</p>
                </div>
            </div>

            {/* Content Body */}
            <div className="glass-panel p-6 rounded-2xl border-border/50">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search orders by ID, Customer Name, or Product..."
                            className="w-full bg-muted/50 border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                    </div>
                    <select className="bg-muted/50 rounded-xl px-4 py-2.5 text-sm border-transparent focus:border-accent focus:ring-1 focus:ring-accent outline-none">
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-2xl">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted/50 mb-4">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-6">When customers purchase your products, their orders will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                                <tr>
                                    <th className="px-6 py-4 font-bold rounded-tl-xl whitespace-nowrap">Order ID / Date</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Customer</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Amount</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Status</th>
                                    <th className="px-6 py-4 font-bold rounded-tr-xl text-right whitespace-nowrap">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {orders.map((order) => (
                                    <tr key={order.id || order._id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono font-bold text-xs">{(order._id || order.id || "").substring(0, 8).toUpperCase()}</div>
                                            <div className="text-muted-foreground text-xs mt-1">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold">{order.shippingAddress?.name || order.user?.name || "Customer"}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium">
                                            ₹{((order.totalAmount || order.total || order.amount || 0) / 100).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(order.status)}
                                                <span className="capitalize font-medium text-xs">{order.status || 'processing'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1 text-xs">
                                                View <ArrowUpRight className="h-3 w-3" />
                                            </button>
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
