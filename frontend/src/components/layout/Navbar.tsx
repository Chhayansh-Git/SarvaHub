"use client";

import Link from "next/link";
import { ShoppingBag, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { OmniSearchBar } from "@/components/search/OmniSearchBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { api } from "@/lib/api";

interface Category {
    id: string;
    _id?: string;
    name: string;
    slug: string;
}

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const pathname = usePathname();
    const { isAuthenticated, openAuthModal } = useUserStore();
    const itemCount = useCartStore(state => state.itemCount);
    const fetchCart = useCartStore(state => state.fetchCart);

    useEffect(() => {
        setMounted(true);
        // Fetch cart on mount when authenticated
        if (isAuthenticated) fetchCart();

        // Fetch categories
        const loadCategories = async () => {
            try {
                const data = await api.get<any>('/categories');
                const fetchedCategories = Array.isArray(data) ? data : data.categories || [];
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Failed to load categories:', error);
                setCategories([]);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        loadCategories();
    }, [isAuthenticated, fetchCart]);

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
                    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold h-full">
                        <div className="relative group h-full flex items-center">
                            <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors py-4">
                                Categories
                            </Link>
                            <div className="absolute top-[80px] left-[-20px] w-56 bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 flex flex-col z-[100]">
                                {isLoadingCategories ? (
                                    <div className="px-4 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                        Loading...
                                    </div>
                                ) : categories.length > 0 ? (
                                    categories.map((category) => (
                                        <Link
                                            key={category.id || category._id || category.slug}
                                            href={`/category/${category.slug}`}
                                            className="px-4 py-2.5 text-sm hover:bg-accent/10 rounded-lg hover:text-accent font-medium transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-2.5 text-sm text-muted-foreground">No categories found</div>
                                )}
                            </div>
                        </div>
                        {isAuthenticated ? (
                            <Link href="/account/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                                My Orders
                            </Link>
                        ) : (
                            <button onClick={() => openAuthModal('login')} className="text-muted-foreground hover:text-foreground transition-colors">
                                My Orders
                            </button>
                        )}
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
                                {itemCount}
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
