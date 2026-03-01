"use client";

import { BarChart3, TrendingUp, ArrowUpRight, DollarSign, Users } from "lucide-react";

export default function SellerAnalyticsPage() {

    // Mock Chart Bars
    const maxVal = 100;
    const chartData = [40, 65, 30, 85, 55, 90, 75];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-accent" />
                        Performance Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm text-balance">Track your revenue, profile visits, and conversion rates.</p>
                </div>

                <select className="px-5 py-2.5 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-accent text-sm font-semibold shadow-sm">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Quarter</option>
                    <option>Year to Date</option>
                </select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg"><DollarSign className="h-5 w-5 text-green-500" /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                            <ArrowUpRight className="h-3 w-3" /> 12.5%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-black tracking-tighter">₹4.2M</h3>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><TrendingUp className="h-5 w-5 text-blue-500" /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                            <ArrowUpRight className="h-3 w-3" /> 8.2%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Orders Processed</p>
                    <h3 className="text-3xl font-black tracking-tighter">1,245</h3>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg"><Users className="h-5 w-5 text-purple-500" /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                            <ArrowUpRight className="h-3 w-3" /> 24%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Store Visitors</p>
                    <h3 className="text-3xl font-black tracking-tighter">48.5K</h3>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-accent/10 rounded-lg"><BarChart3 className="h-5 w-5 text-accent" /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                            - 2.1%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Conversion Rate</p>
                    <h3 className="text-3xl font-black tracking-tighter">2.4%</h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Revenue Chart */}
                <div className="glass-panel p-8 rounded-3xl border border-border/50 lg:col-span-2">
                    <div className="flex justify-between mb-12">
                        <div>
                            <h3 className="text-lg font-bold">Revenue Overview</h3>
                            <p className="text-sm text-muted-foreground">Daily sales performance</p>
                        </div>
                    </div>

                    {/* CSS-only Bar Chart implementation for visual mockup */}
                    <div className="h-64 flex items-end justify-between gap-2 relative">
                        {/* Fake Y Axis Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-border/50 pb-8 pl-2 pointer-events-none">
                            <div className="w-full border-t border-border/30 border-dashed"></div>
                            <div className="w-full border-t border-border/30 border-dashed"></div>
                            <div className="w-full border-t border-border/30 border-dashed"></div>
                        </div>

                        {chartData.map((val, i) => (
                            <div key={i} className="relative flex flex-col items-center flex-1 h-full z-10 group">
                                <div className="w-full relative h-[calc(100%-2rem)] flex items-end justify-center pb-1">
                                    <div
                                        className="w-[60%] bg-accent/80 group-hover:bg-accent rounded-t text-transparent transition-all duration-700 ease-out"
                                        style={{ height: `${(val / maxVal) * 100}%` }}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute top-0 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs font-bold px-3 py-2 rounded-lg pointer-events-none whitespace-nowrap shadow-xl">
                                        ₹{(val * 14200).toLocaleString()}
                                    </div>
                                </div>
                                <div className="h-8 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                    {days[i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="glass-panel p-8 rounded-3xl border border-border/50">
                    <h3 className="text-lg font-bold mb-1">Top Selling Items</h3>
                    <p className="text-sm text-muted-foreground mb-8">By volume this week</p>

                    <div className="space-y-6">
                        {[
                            { name: "Oyster Perpetual 36", brand: "Rolex", sales: 42, rev: "₹22.6M" },
                            { name: "Le Chiquito Mini", brand: "Jacquemus", sales: 128, rev: "₹7.4M" },
                            { name: "AirPods Max", brand: "Apple", sales: 85, rev: "₹3.8M" },
                            { name: "S24 Ultra", brand: "Samsung", sales: 15, rev: "₹1.8M" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-xl font-black text-muted-foreground/30">{i + 1}</span>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-muted-foreground uppercase">{item.brand}</p>
                                </div>
                                <div className="text-right">
                                    <h4 className="font-bold text-sm">{item.rev}</h4>
                                    <p className="text-xs text-muted-foreground">{item.sales} sold</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
