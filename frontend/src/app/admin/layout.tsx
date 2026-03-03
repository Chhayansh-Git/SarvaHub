"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, ShoppingBag, MessageSquare, Tag, LogOut, Loader2, Menu, X } from "lucide-react";
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user?.role !== 'admin') {
                router.push('/');
            }
        }
    }, [isAuthenticated, user, isLoading, router]);

    if (isLoading || !isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        );
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/products', label: 'Products', icon: Tag },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
    ];

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-glass border-r border-border/50 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <h1 className="text-2xl font-heading font-black tracking-tight flex items-center gap-2">
                        <span className="text-accent">SarvaHub</span> Admin
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map(item => {
                        const active = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-accent text-accent-foreground shadow-md' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-border/50">
                    <button onClick={() => { useUserStore.getState().logout(); router.push('/') }} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-colors">
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Nav */}
            <div className="md:hidden fixed top-0 left-0 w-full glass-panel border-b border-border/50 z-50 px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-heading font-black tracking-tight">Admin</h1>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 border border-border/50 rounded-lg">
                    {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="w-64 glass-panel border-r border-border/50 h-full p-4 flex flex-col pt-24" onClick={e => e.stopPropagation()}>
                        <nav className="flex-1 space-y-2">
                            {navItems.map(item => (
                                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}>
                                    <item.icon className="h-5 w-5" /> {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            <main className="flex-1 p-4 md:p-8 pt-24 md:pt-8 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
