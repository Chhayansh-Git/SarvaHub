"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, ArrowLeft, Loader2, Save, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function NotificationsPage() {
    const { isAuthenticated } = useUserStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [prefs, setPrefs] = useState({
        orderUpdates: true,
        promotions: false,
        priceDropAlerts: true,
        sellerMessages: true,
        securityAlerts: true,
        newsletter: false,
    });

    useEffect(() => {
        (async () => {
            try {
                const data = await api.get<any>("/users/me/notifications");
                if (data) setPrefs({ ...prefs, ...data });
            } catch {
                // use defaults
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch("/users/me/notifications", prefs);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            // silently handle
        } finally {
            setSaving(false);
        }
    };

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${checked ? 'bg-accent' : 'bg-muted'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    const categories = [
        { key: 'orderUpdates', label: 'Order Updates', desc: 'Shipping, delivery, and return notifications' },
        { key: 'promotions', label: 'Promotions', desc: 'Sales, deals, and exclusive offers' },
        { key: 'priceDropAlerts', label: 'Price Drop Alerts', desc: 'When items in your wishlist go on sale' },
        { key: 'sellerMessages', label: 'Seller Messages', desc: 'Direct messages from sellers' },
        { key: 'securityAlerts', label: 'Security Alerts', desc: 'Login attempts, password changes' },
        { key: 'newsletter', label: 'Newsletter', desc: 'Weekly curated picks and luxury trends' },
    ];

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                        <Bell className="h-8 w-8 text-accent" />
                        Notification Preferences
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">Choose what notifications you'd like to receive.</p>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-border/50 space-y-6">
                    {categories.map(cat => (
                        <div key={cat.key} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
                            <div>
                                <h3 className="font-semibold text-foreground">{cat.label}</h3>
                                <p className="text-sm text-muted-foreground">{cat.desc}</p>
                            </div>
                            <Toggle
                                checked={(prefs as any)[cat.key]}
                                onChange={() => setPrefs({ ...prefs, [cat.key]: !(prefs as any)[cat.key] })}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-foreground text-background font-bold rounded-xl shadow-lg hover:bg-primary transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : saved ? <CheckCircle2 className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </div>
    );
}
