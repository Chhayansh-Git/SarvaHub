"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { theme } = useTheme();
    const router = useRouter();
    const { isAuthenticated, openAuthModal } = useUserStore();
    const { items, subtotal, itemCount, isLoading, updateQuantity, removeItem, fetchCart } = useCartStore();

    // Sync cart from server when drawer opens and user is authenticated
    useEffect(() => {
        if (isOpen && isAuthenticated) {
            fetchCart();
        }
    }, [isOpen, isAuthenticated, fetchCart]);

    const handleCheckout = () => {
        if (!isAuthenticated) {
            onClose();
            openAuthModal('login');
            return;
        }
        onClose();
        router.push("/checkout");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`fixed inset-y-0 right-0 z-[101] w-full sm:w-[500px] border-l ${theme === 'dark' ? 'border-white/10 bg-black/60' : 'border-black/5 bg-white/70'} backdrop-blur-2xl shadow-2xl flex flex-col`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-5 w-5" />
                                <h2 className="text-xl font-heading font-black">Your Bag</h2>
                                <span className="bg-accent text-accent-foreground text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {itemCount}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-muted transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                                    <div className="h-16 w-16 mb-4 rounded-full border-4 border-muted border-t-accent animate-spin" />
                                    <p className="text-sm text-muted-foreground">Loading your bag...</p>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                                    <ShoppingBag className="h-16 w-16 mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-bold mb-2">Your bag is empty</h3>
                                    <p className="text-sm text-muted-foreground">Looks like you haven&apos;t added any luxury pieces yet.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        {/* Image */}
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border shrink-0 bg-muted">
                                            <Image src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'} alt={item.name} fill className="object-cover" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{item.name}</h4>
                                                    {item.attributes && (
                                                        <p className="text-xs text-muted-foreground mt-1">{item.attributes}</p>
                                                    )}
                                                </div>
                                                <button onClick={() => removeItem(item.productId)} className="text-muted-foreground hover:text-red-500 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Stepper */}
                                                <div className="flex items-center gap-3 bg-muted/50 rounded-full px-2 py-1 border border-border">
                                                    <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="p-1 hover:text-accent disabled:opacity-50" disabled={item.quantity <= 1}>
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 hover:text-accent">
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <span className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-md">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-medium text-muted-foreground">Subtotal</span>
                                    <span className="text-2xl font-bold font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>

                                <p className="text-xs text-center text-muted-foreground mb-6">
                                    Taxes and shipping calculated at checkout.
                                </p>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-foreground text-background font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-lg hover:shadow-xl group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
