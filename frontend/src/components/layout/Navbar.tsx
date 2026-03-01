"use client";

import Link from "next/link";
import { ShoppingBag, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { OmniSearchBar } from "@/components/search/OmniSearchBar";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, openAuthModal } = useUserStore();

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    // Hide consumer navbar on seller routes
    if (pathname.startsWith('/seller')) {
        return null;
    }

    return (
        <>
            <header className="fixed top-0 inset-x-0 z-50 glass-panel border-b border-glass-border">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-3xl font-heading font-black tracking-tighter bg-gradient-to-r from-accent to-yellow-600 bg-clip-text text-transparent">
                            SARVAHUB
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
                        <Link href="/account/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                            My Orders
                        </Link>
                        <Link href="/support/tickets" className="text-muted-foreground hover:text-foreground transition-colors">
                            Support Tickets
                        </Link>
                        <Link href="/seller" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                            Sell on SarvaHub <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full uppercase">New</span>
                        </Link>
                    </nav>

                    {/* Omni-Search Bar (Desktop) */}
                    <OmniSearchBar />

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2.5 rounded-full hover:bg-muted transition-colors text-foreground"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                        )}

                        {isAuthenticated ? (
                            <Link href="/account" className="p-2.5 rounded-full hover:bg-muted transition-colors">
                                <User className="h-5 w-5" />
                            </Link>
                        ) : (
                            <button onClick={() => openAuthModal('login')} className="p-2.5 rounded-full hover:bg-muted transition-colors">
                                <User className="h-5 w-5" />
                            </button>
                        )}

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2.5 rounded-full hover:bg-muted transition-colors relative"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
                                3
                            </span>
                        </button>
                    </div>

                </div>
            </header>

            {/* Global Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
