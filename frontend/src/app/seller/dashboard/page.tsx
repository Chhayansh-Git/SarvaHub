import { KPICard } from "@/components/seller/KPICard";
import { RevenueChart } from "@/components/seller/RevenueChart";
import { SellerTrustBadge } from "@/components/seller/SellerTrustBadge";
import { IndianRupee, ShoppingBag, PackageOpen, TrendingUp, MoreHorizontal, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const recentOrders = [
    { id: "ORD-9283", product: "Royal Oak Automatic", customer: "Rahul V.", amount: 840000, status: "pending", date: "Today, 10:42 AM", image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=150&q=80" },
    { id: "ORD-9282", product: "Silk Kanjeevaram Saree", customer: "Priya S.", amount: 45000, status: "processing", date: "Yesterday, 4:15 PM", image: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=150&q=80" },
    { id: "ORD-9281", product: "MacBook Pro M3 Max", customer: "Amit K.", amount: 319900, status: "shipped", date: "Yesterday, 1:30 PM", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&q=80" },
    { id: "ORD-9280", product: "Sony Alpha A7 IV", customer: "Neha M.", amount: 215000, status: "delivered", date: "Oct 24, 09:20 AM", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&q=80" },
];

export default function SellerDashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight">Welcome back, Titan Watches</h1>
                    <p className="text-muted-foreground mt-1">Here is what is happening with your store today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 glass-panel rounded-xl font-medium hover:bg-muted transition-colors text-sm">
                        Download Report
                    </button>
                    <Link href="/seller/listing/new" className="px-5 py-2.5 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors text-sm shadow-md">
                        + New Listing
                    </Link>
                </div>
            </div>

            {/* Top Row: Trust Badge & Key Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <SellerTrustBadge tier="enterprise" score={98} verified={true} />
                </div>
                <div className="glass-panel rounded-2xl p-6 border-border/50 flex flex-col justify-center">
                    <h3 className="font-bold mb-2">Pending Actions</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-rose-500 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> 12 Orders to fulfill</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-amber-500 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> 3 Returns requested</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Revenue" value="₹12.4M" trend={14.2} icon={<IndianRupee className="h-6 w-6" />} />
                <KPICard title="Total Orders" value="1,284" trend={8.1} icon={<ShoppingBag className="h-6 w-6" />} />
                <KPICard title="Active Listings" value="342" trend={-2.4} icon={<PackageOpen className="h-6 w-6" />} />
                <KPICard title="Conversion Rate" value="3.8%" trend={1.2} icon={<TrendingUp className="h-6 w-6" />} />
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
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-lg bg-accent/10 overflow-hidden relative shrink-0 border border-border">
                                    <Image src={order.image} alt={order.product} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">{order.product}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                        <span>{order.customer}</span>
                                        <span>•</span>
                                        <span>{order.date}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="font-mono font-bold text-sm">₹{(order.amount / 1000).toFixed(1)}k</div>
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
