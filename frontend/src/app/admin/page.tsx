"use client";

import { useEffect, useState } from "react";
import { Users, ShoppingBag, DollarSign, Tag, MessageSquare, ArrowUpRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await api.get('/admin/stats');
                setStats(data);
            } catch {
                // Ignore initial failure structure
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount / 100);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-heading font-black tracking-tight">System Overview</h1>
                <p className="text-muted-foreground mt-1">Platform metrics and recent activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl"><DollarSign className="h-6 w-6 text-emerald-500" /></div>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Checkout</p>
                    <h3 className="text-3xl font-black tracking-tighter">{formatCurrency(stats?.totalRevenue || 0)}</h3>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl"><ShoppingBag className="h-6 w-6 text-blue-500" /></div>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Orders</p>
                    <h3 className="text-3xl font-black tracking-tighter">{stats?.orders || 0}</h3>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl"><Users className="h-6 w-6 text-purple-500" /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                            <ArrowUpRight className="h-3 w-3" /> {stats?.sellers || 0} Sellers
                        </span>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Users</p>
                    <h3 className="text-3xl font-black tracking-tighter">{stats?.users || 0}</h3>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl"><Tag className="h-6 w-6 text-orange-500" /></div>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Active Products</p>
                    <h3 className="text-3xl font-black tracking-tighter">{stats?.products || 0}</h3>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-border/50">
                <h3 className="text-xl font-bold mb-6">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                            <tr>
                                <th className="p-4 font-medium">Order ID</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {stats?.recentOrders?.map((order: any) => (
                                <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium">{order._id.substring(0, 8)}...</td>
                                    <td className="p-4">{order.userId?.name || 'Unknown'}</td>
                                    <td className="p-4 font-bold">{formatCurrency(order.totalAmount)}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No recent orders.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
