"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreditCard, ArrowLeft, Plus, MoreVertical, Trash2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const MOCK_METHODS = [
    { id: "pm_1", brand: "VISA", last4: "4242", name: "John Doe", expMonth: 12, expYear: 28, isDefault: true, color: "from-zinc-900 via-zinc-800 to-black text-white", textAccent: "text-white" },
    { id: "pm_2", brand: "AMEX", last4: "1005", name: "John Doe", expMonth: 5, expYear: 26, isDefault: false, color: "bg-muted/50 text-foreground", textAccent: "text-blue-600" }
];

export default function PaymentsPage() {
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    const [methods, setMethods] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPaymentMethods() {
            try {
                const data = await api.get<any>('/payments/methods');
                const list = Array.isArray(data) ? data : (data.methods || []);
                setMethods(list.length > 0 ? list : MOCK_METHODS);
            } catch (error) {
                // Backend not ready — keep fallback data
                setMethods(MOCK_METHODS);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPaymentMethods();
    }, []);

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
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-muted-foreground animate-pulse">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-accent" />
                        <p>Loading your payment methods...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {methods.map((method) => {
                            const isPremium = method.isDefault || method.brand === "VISA";
                            const containerClass = isPremium
                                ? "from-zinc-900 via-zinc-800 to-black text-white"
                                : "bg-muted/50 text-foreground";

                            return (
                                <div key={method.id} className={`relative glass-panel rounded-3xl p-6 overflow-hidden border ${isPremium ? 'border-accent/30 shadow-lg shadow-accent/5' : 'border-border/50'} group`}>
                                    {isPremium ? (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black opacity-90 dark:opacity-100 z-0 pointer-events-none"></div>
                                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 blur-3xl rounded-full z-0 pointer-events-none"></div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-muted/50 z-0 pointer-events-none"></div>
                                    )}

                                    <div className={`relative z-10 flex flex-col h-full ${isPremium ? 'text-white' : ''}`}>
                                        <div className="flex items-start justify-between mb-8">
                                            <div className={`text-2xl font-black ${isPremium ? 'italic tracking-tighter' : 'text-blue-600'}`}>{method.brand}</div>
                                            <div className="flex items-center gap-3">
                                                {method.isDefault && (
                                                    <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">Default</span>
                                                )}
                                                <button className={`${isPremium ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-red-500'} transition-colors`}>
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <div className={`flex items-center gap-4 text-xl tracking-[0.2em] font-mono ${!isPremium ? 'text-foreground/80' : ''}`}>
                                                <span>••••</span>
                                                <span>••••</span>
                                                <span>••••</span>
                                                <span>{method.last4}</span>
                                            </div>
                                            <div className="flex justify-between items-end text-sm">
                                                <div>
                                                    <p className={`${isPremium ? 'text-white/50' : 'text-muted-foreground'} text-[10px] uppercase tracking-widest mb-1`}>Card Holder</p>
                                                    <p className={`font-semibold tracking-wide uppercase ${!isPremium ? 'text-foreground/80' : ''}`}>{method.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`${isPremium ? 'text-white/50' : 'text-muted-foreground'} text-[10px] uppercase tracking-widest mb-1`}>Expires</p>
                                                    <p className={`font-semibold tracking-wide ${!isPremium ? 'text-foreground/80' : ''}`}>{method.expMonth.toString().padStart(2, '0')} / {method.expYear}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {!method.isDefault && (
                                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                            <button className="px-6 py-2 bg-foreground text-background font-bold rounded-lg text-sm shadow-xl">
                                                Set as Default
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}
