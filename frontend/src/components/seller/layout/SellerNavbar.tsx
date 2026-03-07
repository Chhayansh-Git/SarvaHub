"use client";

import Link from "next/link";
import { Search, Bell, User, Sun, Moon, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function SellerNavbar() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/seller/market?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="fixed top-0 inset-x-0 z-50 glass-panel border-b border-glass-border">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4 lg:gap-8">

                {/* Logo & Branding */}
                <Link href="/seller/dashboard" className="flex items-center gap-2 shrink-0">
                    <span className="text-2xl lg:text-3xl font-heading font-black tracking-tighter bg-gradient-to-r from-accent to-yellow-600 bg-clip-text text-transparent">
                        SARVAHUB
                    </span>
                    <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent tracking-widest uppercase ml-2">
                        Seller
                    </span>
                </Link>

                {/* Seller Search Bar */}
                <div className="flex-1 max-w-2xl hidden sm:block">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search active listings or research market trends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background/50 border border-border/50 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-muted-foreground/70"
                        />
                        <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center">
                            <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-border">
                                <span className="text-xs">⌘</span> K
                            </kbd>
                        </div>
                    </form>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {/* Marketplace Link */}
                    <Link
                        href="/seller/market"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full hover:bg-accent/20 transition-all text-sm"
                    >
                        <Store className="h-4 w-4" />
                        Marketplace
                    </Link>

                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2.5 rounded-full hover:bg-muted transition-colors text-foreground"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    )}

                    {/* Notifications */}
                    <button className="p-2.5 rounded-full hover:bg-muted transition-colors relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background"></span>
                    </button>

                    {/* Profile */}
                    <Link href="/seller/settings" className="p-2.5 rounded-full hover:bg-muted transition-colors">
                        <User className="h-5 w-5" />
                    </Link>
                </div>

            </div>
        </header>
    );
}
