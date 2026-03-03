"use client";

import { useEffect, useState } from "react";
import { Settings, Building2, Loader2, Save, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SellerSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        businessName: "",
        description: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
    });

    useEffect(() => {
        (async () => {
            try {
                const user = await api.get<any>("/auth/me");
                const sp = user?.user?.sellerProfile || user?.sellerProfile || {};
                setForm({
                    businessName: sp.businessName || "",
                    description: sp.description || "",
                    location: sp.location || "",
                    contactEmail: sp.contactEmail || "",
                    contactPhone: sp.contactPhone || "",
                });
            } catch {
                // empty
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch("/seller/settings", form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            // silently handle
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-10">
                <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3 mb-2">
                    <Settings className="h-8 w-8 text-accent" />
                    Business Settings
                </h1>
                <p className="text-muted-foreground text-sm">Manage your seller profile, business details, and contact information.</p>
            </div>

            <div className="space-y-8">
                <div className="glass-panel p-8 rounded-3xl border border-border/50">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                        <div className="p-3 bg-muted rounded-xl"><Building2 className="h-6 w-6 text-foreground" /></div>
                        <div>
                            <h3 className="text-lg font-bold">Public Profile</h3>
                            <p className="text-sm text-muted-foreground">This information is displayed to buyers.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Business Name</label>
                            <input
                                type="text"
                                className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all"
                                value={form.businessName}
                                onChange={e => setForm({ ...form, businessName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Store Description</label>
                            <textarea
                                rows={3}
                                className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Tell customers about your business..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Location</label>
                                <input
                                    type="text"
                                    className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all"
                                    value={form.location}
                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                    placeholder="Mumbai, India"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Contact Email</label>
                                <input
                                    type="email"
                                    className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all"
                                    value={form.contactEmail}
                                    onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Contact Phone</label>
                            <input
                                type="tel"
                                className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all"
                                value={form.contactPhone}
                                onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-4 bg-foreground text-background font-bold rounded-xl shadow-lg hover:bg-primary transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : saved ? <CheckCircle2 className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
