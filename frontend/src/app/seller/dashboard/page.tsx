"use client";

import { KPICard } from "@/components/seller/KPICard";
import { RevenueChart } from "@/components/seller/RevenueChart";
import { SellerTrustBadge } from "@/components/seller/SellerTrustBadge";
import { IndianRupee, ShoppingBag, PackageOpen, TrendingUp, MoreHorizontal, ArrowUpRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

import { ReportDownloadButton } from "@/components/seller/ReportDownloadButton";

const EMPTY_STATS = {
    revenue: "₹0", revenueTrend: 0,
    orders: "0", ordersTrend: 0,
    listings: "0", listingsTrend: 0,
    conversion: "0%", conversionTrend: 0,
    pendingOrders: 0, returns: 0,
    trustScore: 50, isVerified: false
};

export default function SellerDashboardPage() {
    const { user } = useUserStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState(EMPTY_STATS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch seller orders and stats natively from the backend
                const [ordersData, statsData] = await Promise.all([
                    api.get<any[]>('/seller/orders').catch(() => null),
                    api.get<any>('/seller/stats').catch(() => null)
                ]);

                if (ordersData && Array.isArray(ordersData)) {
                    setOrders(ordersData);
                } else {
                    setOrders([]);
                }

                if (statsData) {
                    setStats(statsData);
                }
            } catch (error) {
                // Backend not ready — fallback empty
                setOrders([]);
                setStats(EMPTY_STATS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const displayName = user?.name || "Titan Watches";

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
                    <h1 className="text-3xl font-heading font-black tracking-tight">Welcome back, {displayName}</h1>
                    <p className="text-muted-foreground mt-1">Here is what is happening with your store today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ReportDownloadButton />
                    <Link href="/seller/listing/new" className="px-5 py-2.5 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors text-sm shadow-md">
                        + New Listing
                    </Link>
                </div>
            </div>

            {/* Top Row: Trust Badge & Key Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <SellerTrustBadge
                        tier={stats.trustScore >= 80 ? 'enterprise' : stats.trustScore >= 60 ? 'professional' : 'starter'}
                        score={stats.trustScore || 50}
                        verified={stats.isVerified || false}
                    />
                </div>
                <div className="glass-panel rounded-2xl p-6 border-border/50 flex flex-col justify-center">
                    <h3 className="font-bold mb-2">Pending Actions</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-rose-500 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> {stats.pendingOrders || 0} Orders to fulfill</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-amber-500 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> {stats.returns || 0} Returns requested</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Revenue" value={stats.revenue} trend={stats.revenueTrend} icon={<IndianRupee className="h-6 w-6" />} />
                <KPICard title="Total Orders" value={stats.orders} trend={stats.ordersTrend} icon={<ShoppingBag className="h-6 w-6" />} />
                <KPICard title="Active Listings" value={stats.listings} trend={stats.listingsTrend} icon={<PackageOpen className="h-6 w-6" />} />
                <KPICard title="Conversion Rate" value={stats.conversion} trend={stats.conversionTrend} icon={<TrendingUp className="h-6 w-6" />} />
            </div>

            {/* Charts & Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 glass-panel rounded-2xl border-border/50 overflow-hidden min-h-[400px]">
                    <RevenueChart />
                </div>

                {/* Recent Orders */}
                <div className="glass-panel p-6 rounded-2xl border-border/50 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading font-black text-lg">Recent Orders</h3>
                        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {orders.map((order) => (
                            <div key={order.id || order._id} className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-lg bg-accent/10 overflow-hidden relative shrink-0 border border-border">
                                    <Image src={order.image || order.items?.[0]?.product?.images?.[0] || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=150&q=80'} alt={order.product || 'Product'} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">{order.product || `Order #${order._id?.substring(0, 6).toUpperCase()}`}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                        <span>{order.customer || order.user?.name || 'Customer'}</span>
                                        <span>•</span>
                                        <span>{order.date || new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="font-mono font-bold text-sm">₹{((order.amount || order.totalAmount) / 1000).toFixed(1)}k</div>
                                    <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${order.status === 'delivered' ? 'text-emerald-500' :
                                        order.status === 'shipped' ? 'text-blue-500' :
                                            order.status === 'processing' ? 'text-amber-500' :
                                                'text-rose-500'
                                        }`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground bg-muted/50 rounded-xl transition-colors">
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    );
}
