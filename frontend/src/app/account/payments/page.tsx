"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreditCard, ArrowLeft, Plus, MoreVertical, Trash2 } from "lucide-react";

export default function PaymentsPage() {
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.push('/');
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/account')} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                                <CreditCard className="h-8 w-8 text-accent" />
                                Payment Methods
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">Manage your saved cards and payment preferences</p>
                        </div>
                    </div>

                    <button className="px-5 py-2.5 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0">
                        <Plus className="h-4 w-4" /> Add New Card
                    </button>
                </div>

                {/* Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Primary Card */}
                    <div className="relative glass-panel rounded-3xl p-6 overflow-hidden border border-accent/30 shadow-lg shadow-accent/5">
                        {/* Beautiful gradient background for the premium card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black opacity-90 dark:opacity-100 z-0 pointer-events-none"></div>
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 blur-3xl rounded-full z-0 pointer-events-none"></div>

                        <div className="relative z-10 text-white flex flex-col h-full">
                            <div className="flex items-start justify-between mb-8">
                                <div className="text-2xl font-black italic tracking-tighter">VISA</div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">Default</span>
                                    <button className="text-white/70 hover:text-white transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-center gap-4 text-xl tracking-[0.2em] font-mono">
                                    <span>••••</span>
                                    <span>••••</span>
                                    <span>••••</span>
                                    <span>4242</span>
                                </div>
                                <div className="flex justify-between items-end text-sm">
                                    <div>
                                        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Card Holder</p>
                                        <p className="font-semibold tracking-wide uppercase">John Doe</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Expires</p>
                                        <p className="font-semibold tracking-wide">12 / 28</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Card (Amex) */}
                    <div className="relative glass-panel rounded-3xl p-6 overflow-hidden border border-border/50">
                        {/* Lighter card bg */}
                        <div className="absolute inset-0 bg-muted/50 z-0 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-8">
                                <div className="text-xl font-bold text-blue-600 tracking-tighter">AMEX</div>
                                <button className="text-muted-foreground hover:text-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-center gap-4 text-lg tracking-[0.1em] font-mono text-foreground/80">
                                    <span>••••</span>
                                    <span>••••••</span>
                                    <span>1005</span>
                                </div>
                                <div className="flex justify-between items-end text-sm text-foreground/80">
                                    <div>
                                        <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Card Holder</p>
                                        <p className="font-medium tracking-wide uppercase">John Doe</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Expires</p>
                                        <p className="font-medium tracking-wide">05 / 26</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hover Overlay to make default */}
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                            <button className="px-6 py-2 bg-foreground text-background font-bold rounded-lg text-sm shadow-xl">
                                Set as Default
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
