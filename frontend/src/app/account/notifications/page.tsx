"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, ArrowLeft, Mail, Smartphone, MessageSquare } from "lucide-react";

export default function NotificationsPage() {
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    // Local state for mock toggles
    const [emailAlerts, setEmailAlerts] = useState({ orders: true, promos: false, surveys: true });
    const [pushAlerts, setPushAlerts] = useState({ orders: true, backInStock: true, priceDrops: false });

    useEffect(() => {
        if (!isAuthenticated) router.push('/');
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${checked ? 'bg-accent' : 'bg-muted'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.push('/account')} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                            <Bell className="h-8 w-8 text-accent" />
                            Notifications
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">Choose how and when we communicate with you</p>
                    </div>
                </div>

                <div className="space-y-6">

                    {/* Email Settings */}
                    <div className="glass-panel p-8 rounded-3xl border border-border/50">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                            <div className="p-3 bg-muted rounded-xl"><Mail className="h-6 w-6 text-foreground" /></div>
                            <div>
                                <h3 className="text-lg font-bold">Email Notifications</h3>
                                <p className="text-sm text-muted-foreground">Updates sent directly to your inbox.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold mb-1">Order Updates & Tracking</h4>
                                    <p className="text-sm text-muted-foreground">Confirmations, shipping notices, and delivery alerts.</p>
                                </div>
                                <Toggle checked={emailAlerts.orders} onChange={() => setEmailAlerts({ ...emailAlerts, orders: !emailAlerts.orders })} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold mb-1">Exclusive Promotions</h4>
                                    <p className="text-sm text-muted-foreground">Sales, new arrivals, and personalized offers.</p>
                                </div>
                                <Toggle checked={emailAlerts.promos} onChange={() => setEmailAlerts({ ...emailAlerts, promos: !emailAlerts.promos })} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold mb-1">Surveys & Feedback</h4>
                                    <p className="text-sm text-muted-foreground">Help us improve the SarvaHub experience.</p>
                                </div>
                                <Toggle checked={emailAlerts.surveys} onChange={() => setEmailAlerts({ ...emailAlerts, surveys: !emailAlerts.surveys })} />
                            </div>
                        </div>
                    </div>

                    {/* Push/App Settings */}
                    <div className="glass-panel p-8 rounded-3xl border border-border/50">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                            <div className="p-3 bg-muted rounded-xl"><Smartphone className="h-6 w-6 text-foreground" /></div>
                            <div>
                                <h3 className="text-lg font-bold">Push Notifications</h3>
                                <p className="text-sm text-muted-foreground">Instant alerts on your device.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold mb-1">Delivery Status</h4>
                                    <p className="text-sm text-muted-foreground">Real-time alerts when your package is out for delivery.</p>
                                </div>
                                <Toggle checked={pushAlerts.orders} onChange={() => setPushAlerts({ ...pushAlerts, orders: !pushAlerts.orders })} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold mb-1">Back in Stock Alerts</h4>
                                    <p className="text-sm text-muted-foreground">When items on your wishlist become available.</p>
                                </div>
                                <Toggle checked={pushAlerts.backInStock} onChange={() => setPushAlerts({ ...pushAlerts, backInStock: !pushAlerts.backInStock })} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold mb-1">Price Drops</h4>
                                    <p className="text-sm text-muted-foreground">Alerts when saved items go on sale.</p>
                                </div>
                                <Toggle checked={pushAlerts.priceDrops} onChange={() => setPushAlerts({ ...pushAlerts, priceDrops: !pushAlerts.priceDrops })} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors">
                            Save Preferences
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
