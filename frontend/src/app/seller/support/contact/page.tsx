"use client";

import { Phone, Mail, MessageSquare, ShieldCheck } from "lucide-react";

export default function SellerContactPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="mb-10 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-heading font-black tracking-tight mb-4">
                    Contact Merchant Support
                </h1>
                <p className="text-muted-foreground text-sm">
                    Our dedicated merchant success team is available 24/7 to resolve disputes, tackle technical issues, and help you grow your business.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Contact Options Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <div className="glass-panel p-6 rounded-2xl border border-border/50 text-center flex flex-col items-center">
                        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="h-6 w-6 text-foreground" />
                        </div>
                        <h3 className="font-bold mb-1">Live Chat</h3>
                        <p className="text-xs text-muted-foreground mb-4">Average response time: 2 mins</p>
                        <button className="w-full py-2 bg-foreground text-background font-bold rounded-lg text-sm hover:bg-primary transition-colors">Start Chat</button>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-border/50 text-center flex flex-col items-center">
                        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Phone className="h-6 w-6 text-foreground" />
                        </div>
                        <h3 className="font-bold mb-1">Phone Callback</h3>
                        <p className="text-xs text-muted-foreground mb-4">Available for Elite Sellers</p>
                        <button className="w-full py-2 bg-background border border-border/50 font-bold rounded-lg text-sm hover:border-accent transition-colors">Schedule Call</button>
                    </div>

                    <div className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded-2xl">
                        <ShieldCheck className="h-8 w-8 text-green-500 mb-3" />
                        <h4 className="font-bold text-sm mb-2">Priority Routing</h4>
                        <p className="text-xs text-muted-foreground">Because you maintain a 98% positive feedback score, your tickets go straight to tier-2 support.</p>
                    </div>
                </div>

                {/* Ticket Form */}
                <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-border/50">
                    <h3 className="text-xl font-bold mb-6">Open a Support Ticket</h3>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Issue Category</label>
                            <select className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent font-medium">
                                <option>Order Fulfillment & Shipping</option>
                                <option>Buyer Dispute / Return</option>
                                <option>Payout or Billing Issue</option>
                                <option>Account Health & Policies</option>
                                <option>Technical Bug</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Order ID (Optional)</label>
                            <input
                                type="text"
                                placeholder="eg. ORD-992B"
                                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Subject</label>
                            <input
                                type="text"
                                placeholder="Brief summary of the issue"
                                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Detailed Description</label>
                            <textarea
                                rows={5}
                                placeholder="Please provide as much context as possible so we can help you faster..."
                                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent resize-none"
                            ></textarea>
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="px-8 py-3 w-full bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                                Submit Ticket
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
