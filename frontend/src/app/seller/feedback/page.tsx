"use client";

import { MessageSquarePlus, Megaphone, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SellerFeedbackPage() {
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="p-8 max-w-3xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500 text-center py-24">
                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-4xl font-heading font-black tracking-tighter mb-4">Thank You!</h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                    Your feedback has been routed directly to the Merchant Experience Product Team. We review all submissions weekly to shape our internal roadmap.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors"
                >
                    Submit Another Idea
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            <div className="flex items-start gap-6 mb-12 p-8 bg-accent/5 border border-accent/20 rounded-3xl">
                <div className="p-4 bg-accent/10 rounded-2xl shrink-0">
                    <Megaphone className="h-8 w-8 text-accent" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold mb-2">Help Us Improve the Seller Portal</h1>
                    <p className="text-muted-foreground">
                        Are we missing a crucial bulk-edit feature? Is the reporting dashboard lacking specific metrics? Let us know. Your direct feedback drives 80% of our merchant tool updates.
                    </p>
                </div>
            </div>

            <form
                className="glass-panel p-8 rounded-3xl border border-border/50"
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            >
                <div className="space-y-8">

                    <div className="space-y-4">
                        <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">What area does your feedback relate to?</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Inventory', 'Orders', 'Payments', 'Analytics', 'Support', 'App', 'API', 'Other'].map(cat => (
                                <label key={cat} className="flex items-center gap-3 p-4 border border-border/50 rounded-xl cursor-pointer hover:border-accent transition-colors bg-background">
                                    <input type="radio" name="category" className="accent-accent" />
                                    <span className="text-sm font-medium">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Your Feature Request or Feedback</label>
                        <textarea
                            required
                            rows={6}
                            placeholder="Please be as specific as possible. What problem are you trying to solve?"
                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-foreground resize-none"
                        ></textarea>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center justify-between">
                            <span>How critical is this to your business?</span>
                        </label>
                        <select className="w-full md:w-1/2 bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent font-medium">
                            <option>Nice to have</option>
                            <option>Minor annoyance</option>
                            <option>Major blocker to growth</option>
                            <option>Critical missing functionality</option>
                        </select>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex justify-end">
                        <button type="submit" className="px-8 py-4 bg-foreground text-background font-bold rounded-xl shadow-lg hover:shadow-primary/20 hover:bg-primary transition-all hover:-translate-y-0.5 flex items-center gap-2">
                            <MessageSquarePlus className="h-5 w-5" /> Submit Feedback
                        </button>
                    </div>
                </div>
            </form>

        </div>
    );
}
