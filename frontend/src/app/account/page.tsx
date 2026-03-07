"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Package, Heart, RefreshCcw, Handshake, LogOut, Settings, CreditCard, Bell, ChevronRight, UserCircle } from "lucide-react";
import Image from "next/image";

export default function AccountDashboard() {
    const { user, isAuthenticated, logout } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && !user) {
            router.push('/');
        }
    }, [isAuthenticated, user, router]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const dashboardCards = [
        { title: "My Orders", icon: Package, href: "/account/orders", desc: "Track, return, or buy items again" },
        { title: "Returns & Exchanges", icon: RefreshCcw, href: "/account/returns", desc: "Manage requested returns and exchanges" },
        { title: "Saved Items", icon: Heart, href: "/account/wishlist", desc: "View items you've favorited" },
        { title: "Support Tickets", icon: Handshake, href: "/support/tickets", desc: "Check status of your inquiries" },
        { title: "Payment Methods", icon: CreditCard, href: "/account/payments", desc: "Manage saved cards and bank accounts" },
        { title: "Profile Settings", icon: Settings, href: "/account/settings", desc: "Update your personal details & password" },
        { title: "Notifications", icon: Bell, href: "/account/notifications", desc: "Manage email and push preferences" },
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center shrink-0">
                            {user.avatar ? (
                                <Image src={user.avatar} alt={user.name} width={96} height={96} className="rounded-full object-cover" />
                            ) : (
                                <UserCircle className="h-12 w-12 text-accent" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight text-foreground mb-1">
                                Welcome, {user.name}
                            </h1>
                            <p className="text-muted-foreground text-sm flex items-center gap-2">
                                <span>{user.email}</span>
                                <span className="bg-muted px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                    {user.role}
                                </span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-6 py-2.5 rounded-full border border-border/50 text-foreground font-semibold hover:bg-muted hover:text-red-500 transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100">
                    {dashboardCards.map((card, idx) => (
                        <Link
                            href={card.href}
                            key={idx}
                            className="group glass-panel border border-border/50 p-6 rounded-2xl hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-1 block"
                        >
                            <div className="flex flex-col h-full">
                                <card.icon className="h-8 w-8 text-muted-foreground group-hover:text-accent transition-colors mb-4" />
                                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
                                    {card.title}
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </h3>
                                <p className="text-sm text-muted-foreground mt-auto">
                                    {card.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
