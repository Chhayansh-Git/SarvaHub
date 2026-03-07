"use client";

import { useEffect, useState } from "react";
import { LineChart, BarChart3, Package, Users, Settings, LogOut, ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

import { SellerNavbar } from "@/components/seller/layout/SellerNavbar";
import { SellerFooter } from "@/components/seller/layout/SellerFooter";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useUserStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Auth guard: only sellers, admins, and users on the onboarding flow can access seller routes
    useEffect(() => {
        if (!isHydrated) return;

        const isOnboarding = pathname.includes('/onboarding');
        if (!user) {
            // Not logged in — redirect to home
            if (!isOnboarding) router.replace('/');
            return;
        }
        if (!isOnboarding && user.role !== 'seller' && user.role !== 'admin') {
            router.replace('/');
        }
    }, [user, pathname, router, isHydrated]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const navItems = [
        { label: "Dashboard", href: "/seller/dashboard", icon: LineChart },
        { label: "Listings", href: "/seller/listings", icon: Package },
        { label: "Orders", href: "/seller/orders", icon: BarChart3 },
        { label: "Customers", href: "/seller/customers", icon: Users },
        { label: "Offers & Discounts", href: "/seller/discounts", icon: Tag },
        { label: "Settings", href: "/seller/settings", icon: Settings },
    ];

    // If it's the onboarding flow, don't show the dashboard sidebar.
    if (pathname.includes('/onboarding')) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <SellerNavbar />
                <main className="flex-1 pt-20">
                    {children}
                </main>
                <SellerFooter />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <SellerNavbar />

            <div className="flex flex-1 pt-20">
                {/* Sidebar */}
                <aside className="w-64 fixed top-20 bottom-0 left-0 border-r border-border/50 glass-panel-light z-40 hidden lg:flex flex-col bg-background/80 backdrop-blur-md">
                    <div className="p-6">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Store Management</p>
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-accent/10 text-accent font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}>
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-auto p-6 border-t border-border/50">
                        <Link href="/seller/listing/new" className="w-full py-3 px-4 bg-accent text-accent-foreground font-bold rounded-xl flex items-center justify-between hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 mb-6">
                            New Listing <ChevronRight className="h-4 w-4" />
                        </Link>

                        <button className="flex items-center gap-3 px-4 py-2 text-rose-500 font-medium hover:bg-rose-500/10 rounded-xl transition-colors w-full">
                            <LogOut className="h-5 w-5" />
                            Log out
                        </button>
                    </div>
                </aside>

                {/* Main Content Area & Footer */}
                <div className="flex-1 flex flex-col lg:ml-64">
                    <main className="flex-1 p-4 md:p-8 lg:p-10 relative">
                        {children}
                    </main>
                    <SellerFooter />
                </div>
            </div>
        </div>
    );
}
