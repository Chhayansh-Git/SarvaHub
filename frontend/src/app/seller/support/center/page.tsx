"use client";

import { LifeBuoy, Book, MessageSquare, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SellerSupportCenterPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                        <LifeBuoy className="h-8 w-8 text-accent" />
                        Seller Help Center
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm text-balance">Tools, articles, and dedicated support for SarvaHub Merchants.</p>
                </div>

                <Link
                    href="/seller/support/contact"
                    className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors hover:shadow-lg hover:-translate-y-0.5 shrink-0"
                >
                    <MessageSquare className="h-4 w-4" /> Open Support Ticket
                </Link>
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Link href="/seller/support/contact" className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-accent/40 transition-colors group">
                    <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Book className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Getting Started</h3>
                    <p className="text-sm text-muted-foreground mb-4">Learn the basics of listing your first product and fulfilling orders.</p>
                    <span className="text-sm font-bold text-accent group-hover:underline flex items-center gap-1">Read Guides <ArrowRight className="h-4 w-4" /></span>
                </Link>

                <Link href="/seller/support/contact" className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-accent/40 transition-colors group">
                    <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MessageSquare className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Managing Buyers</h3>
                    <p className="text-sm text-muted-foreground mb-4">Best practices for communication, disputes, and returns management.</p>
                    <span className="text-sm font-bold text-accent group-hover:underline flex items-center gap-1">View Articles <ArrowRight className="h-4 w-4" /></span>
                </Link>

                <Link href="/seller/support/contact" className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-accent/40 transition-colors group">
                    <div className="h-12 w-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Account Health</h3>
                    <p className="text-sm text-muted-foreground mb-4">Understand performance metrics, seller tiers, and suspension notices.</p>
                    <span className="text-sm font-bold text-accent group-hover:underline flex items-center gap-1">Explore Policies <ArrowRight className="h-4 w-4" /></span>
                </Link>
            </div>

            {/* Recent Tickets Activity */}
            <div className="glass-panel p-8 rounded-3xl border border-border/50">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
                    <div>
                        <h3 className="text-lg font-bold">Recent Support Tickets</h3>
                        <p className="text-sm text-muted-foreground">Track the status of your inquiries with merchant support.</p>
                    </div>
                    <Link href="/seller/support/contact" className="text-sm font-bold text-accent hover:underline">View All</Link>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Ticket #T-8821</span>
                            <h4 className="font-semibold text-sm">Dispute regarding return shipping label cost</h4>
                            <p className="text-xs text-muted-foreground">Opened 2 days ago</p>
                        </div>
                        <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-full text-xs font-bold uppercase tracking-wider">Investigating</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border/50">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Ticket #T-8794</span>
                            <h4 className="font-semibold text-sm">Payout delay for Order ORD-992B</h4>
                            <p className="text-xs text-muted-foreground">Opened 5 days ago</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full text-xs font-bold uppercase tracking-wider">Resolved</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
