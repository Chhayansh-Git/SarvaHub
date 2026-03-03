"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, ArrowUpRight, DollarSign, Users, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Analytics {
    totalRevenue: number;
    monthlyRevenue: number;
    totalOrders: number;
    recentOrderCount: number;
    averageOrderValue: number;
    monthlyBreakdown: { month: string; revenue: number }[];
}

export default function SellerAnalyticsPage() {
    const [data, setData] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get<Analytics>("/seller/analytics");
                setData(res);
            } catch {
                // fallback
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const maxVal = data?.monthlyBreakdown?.length
        ? Math.max(...data.monthlyBreakdown.map(m => m.revenue), 1)
        : 1;

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-accent" />
                        Performance Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm text-balance">Track your revenue, orders, and conversion rates.</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg"><DollarSign className="h-5 w-5 text-green-500" /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                            <ArrowUpRight className="h-3 w-3" /> Live
                        </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-black tracking-tighter">₹{((data?.totalRevenue || 0) / 100).toLocaleString('en-IN')}</h3>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><TrendingUp className="h-5 w-5 text-blue-500" /></div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Orders</p>
                    <h3 className="text-3xl font-black tracking-tighter">{data?.totalOrders || 0}</h3>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg"><Users className="h-5 w-5 text-purple-500" /></div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Recent Orders (30d)</p>
                    <h3 className="text-3xl font-black tracking-tighter">{data?.recentOrderCount || 0}</h3>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-accent/10 rounded-lg"><BarChart3 className="h-5 w-5 text-accent" /></div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Avg Order Value</p>
                    <h3 className="text-3xl font-black tracking-tighter">₹{((data?.averageOrderValue || 0) / 100).toLocaleString('en-IN')}</h3>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="glass-panel p-8 rounded-3xl border border-border/50">
                <div className="flex justify-between mb-12">
                    <div>
                        <h3 className="text-lg font-bold">Revenue Overview</h3>
                        <p className="text-sm text-muted-foreground">Monthly revenue breakdown</p>
                    </div>
                </div>

                {data?.monthlyBreakdown?.length ? (
                    <div className="h-64 flex items-end justify-between gap-2 relative">
                        <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-border/50 pb-8 pl-2 pointer-events-none">
                            <div className="w-full border-t border-border/30 border-dashed"></div>
                            <div className="w-full border-t border-border/30 border-dashed"></div>
                            <div className="w-full border-t border-border/30 border-dashed"></div>
                        </div>

                        {data.monthlyBreakdown.map((item, i) => (
                            <div key={i} className="relative flex flex-col items-center flex-1 h-full z-10 group">
                                <div className="w-full relative h-[calc(100%-2rem)] flex items-end justify-center pb-1">
                                    <div
                                        className="w-[60%] bg-accent/80 group-hover:bg-accent rounded-t text-transparent transition-all duration-700 ease-out"
                                        style={{ height: `${(item.revenue / maxVal) * 100}%` }}
                                    />
                                    <div className="absolute top-0 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs font-bold px-3 py-2 rounded-lg pointer-events-none whitespace-nowrap shadow-xl">
                                        ₹{(item.revenue / 100).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="h-8 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                    {item.month}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <p>No revenue data yet. Start selling to see your analytics here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
