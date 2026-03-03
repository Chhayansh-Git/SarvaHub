"use client";

import { MessageSquarePlus, Megaphone, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

export default function SellerFeedbackPage() {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Other");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/feedback", { title: `[Seller] ${category}: ${title}`, description });
            setSubmitted(true);
        } catch {
            // silently handle
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="p-8 max-w-3xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500 text-center py-24">
                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-4xl font-heading font-black tracking-tighter mb-4">Thank You!</h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                    Your feedback has been submitted and routed to the Merchant Experience Product Team.
                </p>
                <button
                    onClick={() => { setSubmitted(false); setTitle(""); setDescription(""); }}
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
                        Your direct feedback drives our merchant tool updates. Let us know what features you need.
                    </p>
                </div>
            </div>

            <form className="glass-panel p-8 rounded-3xl border border-border/50" onSubmit={handleSubmit}>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Category</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Inventory', 'Orders', 'Payments', 'Analytics', 'Support', 'App', 'API', 'Other'].map(cat => (
                                <label key={cat} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors bg-background ${category === cat ? 'border-accent bg-accent/5' : 'border-border/50 hover:border-accent'}`}>
                                    <input type="radio" name="category" className="accent-accent" checked={category === cat} onChange={() => setCategory(cat)} />
                                    <span className="text-sm font-medium">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Title</label>
                        <input
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Short summary of your feedback"
                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-foreground"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Details</label>
                        <textarea
                            required
                            rows={6}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Please be as specific as possible. What problem are you trying to solve?"
                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-foreground resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex justify-end">
                        <button type="submit" disabled={submitting} className="px-8 py-4 bg-foreground text-background font-bold rounded-xl shadow-lg hover:bg-primary transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50">
                            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageSquarePlus className="h-5 w-5" />}
                            {submitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
