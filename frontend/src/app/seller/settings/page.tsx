"use client";

import { Settings, Building2, CreditCard, ShieldCheck } from "lucide-react";

export default function SellerSettingsPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3 mb-2">
                    <Settings className="h-8 w-8 text-accent" />
                    Business Settings
                </h1>
                <p className="text-muted-foreground text-sm">Manage your seller profile, business verification, and payout preferences.</p>
            </div>

            <div className="space-y-8">

                {/* Business Information */}
                <div className="glass-panel p-8 rounded-3xl border border-border/50">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                        <div className="p-3 bg-muted rounded-xl"><Building2 className="h-6 w-6 text-foreground" /></div>
                        <div>
                            <h3 className="text-lg font-bold">Public Profiler</h3>
                            <p className="text-sm text-muted-foreground">This information is displayed to buyers.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Store Name</label>
                                <input type="text" defaultValue="Lux Emporium" className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Support Email</label>
                                <input type="email" defaultValue="support@luxemporium.com" className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Store Description</label>
                            <textarea rows={3} defaultValue="Curators of fine luxury goods since 2018." className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent resize-none"></textarea>
                        </div>
                    </div>
                </div>

                {/* Compliance & Tax */}
                <div className="glass-panel p-8 rounded-3xl border border-border/50">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-500/10 rounded-xl"><ShieldCheck className="h-6 w-6 text-green-500" /></div>
                            <div>
                                <h3 className="text-lg font-bold">Compliance & Tax Details</h3>
                                <p className="text-sm text-muted-foreground">Your business is fully verified.</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                            Verified Seller
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">GSTIN</label>
                            <input type="text" value="07AABCU9603R1ZM" readOnly className="w-full bg-muted border border-border/50 rounded-xl px-4 py-3 text-muted-foreground cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">PAN</label>
                            <input type="text" value="AABCU****R" readOnly className="w-full bg-muted border border-border/50 rounded-xl px-4 py-3 text-muted-foreground cursor-not-allowed font-mono" />
                        </div>
                    </div>
                </div>

                {/* Payout Information */}
                <div className="glass-panel p-8 rounded-3xl border border-border/50">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                        <div className="p-3 bg-muted rounded-xl"><CreditCard className="h-6 w-6 text-foreground" /></div>
                        <div>
                            <h3 className="text-lg font-bold">Payout Options</h3>
                            <p className="text-sm text-muted-foreground">Where your earnings are credited weekly.</p>
                        </div>
                    </div>

                    <div className="p-5 border border-border/50 rounded-2xl bg-muted/30 flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-background rounded-full border border-border/50 flex flex-col items-center justify-center font-bold font-serif text-lg leading-none pt-1">HDFC</div>
                            <div>
                                <h4 className="font-bold">HDFC Current Account</h4>
                                <p className="text-sm text-muted-foreground font-mono">XXXX-XXXX-XXXX-9844</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-background text-foreground border border-border/50 rounded-lg text-xs font-bold shadow-sm">
                            Primary
                        </span>
                    </div>

                    <button className="text-accent hover:text-accent-foreground font-bold text-sm transition-colors">
                        + Add another bank account
                    </button>
                </div>

                <div className="flex justify-end pt-4">
                    <button className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors shadow-xl hover:-translate-y-1">
                        Save Configuration
                    </button>
                </div>

            </div>
        </div>
    );
}
