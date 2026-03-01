import { ShieldCheck, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export default function SellerCompliancePage() {
    return (
        <div className="p-8 max-w-5xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-accent" />
                        Account Health & Compliance
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Monitor your seller performance metrics and policy adherence.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm font-bold uppercase tracking-wider shrink-0">
                    <CheckCircle2 className="h-4 w-4" /> Account in Good Standing
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-panel p-6 rounded-2xl border border-border/50 transition-all hover:border-accent/40 group">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Seller Rating</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-4xl font-black text-foreground">4.8<span className="text-xl text-muted-foreground">/5</span></h3>
                        <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded font-bold">Excellent</span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-border/50 transition-all hover:border-accent/40 group">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Late Dispatch Rate</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-4xl font-black text-foreground">0.5%</h3>
                        <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded font-bold">&lt; 2% Target</span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-border/50 transition-all hover:border-accent/40 group">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Refund Rate</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-4xl font-black text-foreground">1.2%</h3>
                        <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded font-bold">&lt; 5% Target</span>
                    </div>
                </div>
            </div>

            {/* Alerts & Infractions */}
            <div className="space-y-6">

                <div className="glass-panel p-6 rounded-3xl border border-border/50">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" /> Policy Warnings & Infractions
                    </h3>

                    <div className="bg-muted p-8 rounded-2xl text-center border border-border/50 flex flex-col items-center">
                        <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h4 className="font-bold text-foreground mb-1">No Active Warnings</h4>
                        <p className="text-sm text-muted-foreground">Your account has 0 policy violations in the last 180 days. Keep up the great work.</p>
                    </div>
                </div>

                <div className="bg-accent/5 p-6 rounded-3xl border border-accent/20 flex gap-4 items-start">
                    <Info className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-foreground mb-1">Upcoming Verification Audit</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            In compliance with platform KYC rules, you will need to re-verify your business banking details by December 31st, 2026.
                        </p>
                        <button className="px-6 py-2 bg-foreground text-background font-bold text-sm rounded-lg hover:bg-primary transition-colors">Start Audit Early</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
