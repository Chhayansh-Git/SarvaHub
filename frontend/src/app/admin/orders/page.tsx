"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Package } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const data = await api.get<any>('/admin/orders');
                setOrders(data.orders || []);
            } catch {
                // handle error
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount / 100);
    };

    const filtered = orders.filter(o => o._id.includes(filter) || o.userId?.name?.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight">Order Activity</h1>
                    <p className="text-muted-foreground mt-1">Review all marketplace transactions.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search order ID or explicitly customer..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-border/50 bg-glass rounded-xl text-sm focus:outline-none focus:border-accent w-full md:w-72"
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
                                    <th className="p-5 font-semibold">Order ID</th>
                                    <th className="p-5 font-semibold">Customer</th>
                                    <th className="p-5 font-semibold">Amount</th>
                                    <th className="p-5 font-semibold">Payment</th>
                                    <th className="p-5 font-semibold">Status</th>
                                    <th className="p-5 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filtered.map(order => (
                                    <tr key={order._id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-5 font-medium flex items-center gap-2">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            {order._id.substring(0, 10)}...
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold">{order.userId?.name || 'Unknown'}</div>
                                            <div className="text-xs text-muted-foreground">{order.userId?.email}</div>
                                        </td>
                                        <td className="p-5 font-bold text-foreground">{formatCurrency(order.totalAmount)}</td>
                                        <td className="p-5">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${order.payment?.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {order.payment?.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-muted-foreground">No orders found.</td>
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
