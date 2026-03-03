"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { MessageSquarePlus, ChevronUp, Search, Filter, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface FeedbackItem {
    id: string;
    title: string;
    description: string;
    status: string;
    upvotes: number;
    authorName: string;
}

export default function GeneralFeedbackPage() {
    const { isAuthenticated } = useUserStore();
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get<{ feedback: FeedbackItem[] }>("/feedback");
                setFeedback(res.feedback || []);
            } catch {
                // empty
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fb = await api.post<FeedbackItem>("/feedback", { title, description });
            setFeedback([fb, ...feedback]);
            setTitle("");
            setDescription("");
            setShowForm(false);
        } catch {
            // silently handle
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpvote = async (id: string) => {
        try {
            const updated = await api.post<FeedbackItem>(`/feedback/${id}/upvote`);
            setFeedback(feedback.map(f => f.id === id ? { ...f, upvotes: updated.upvotes } : f));
        } catch {
            // not logged in
        }
    };

    const statusColor = (s: string) => {
        if (s === 'completed') return 'bg-green-500/10 text-green-500 border border-green-500/20';
        if (s === 'in_progress') return 'bg-accent/10 border-accent/20 text-accent';
        if (s === 'planned') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        return 'bg-muted text-muted-foreground';
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs tracking-widest uppercase mb-4 inline-block">
                        Community Voice
                    </span>
                    <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter mb-4">
                        Shape the Future of SarvaHub
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Propose new features, upvote existing ideas, and track what we&apos;re building next.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            className="w-full bg-glass border border-border/50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent shadow-sm"
                        />
                    </div>

                    {isAuthenticated && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-8 py-4 bg-foreground text-background font-bold rounded-2xl hover:bg-primary transition-colors hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 shrink-0"
                        >
                            <MessageSquarePlus className="h-5 w-5" /> Submit Idea
                        </button>
                    )}
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-accent/30 mb-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
                        <input
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Feature title"
                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
                        />
                        <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe your idea..."
                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent resize-none"
                        />
                        <div className="flex justify-end">
                            <button type="submit" disabled={submitting} className="px-6 py-3 bg-accent text-accent-foreground font-bold rounded-xl flex items-center gap-2 disabled:opacity-50">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        {feedback.map(item => (
                            <div key={item.id} className="glass-panel p-6 rounded-3xl border border-border/50 hover:border-accent/40 transition-colors flex gap-5 group">
                                <div className="flex flex-col items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => handleUpvote(item.id)}
                                        className="p-2 border border-border/50 rounded-xl hover:bg-accent hover:border-accent hover:text-accent-foreground text-muted-foreground transition-all group-hover:shadow-md"
                                    >
                                        <ChevronUp className="h-6 w-6 font-bold" />
                                    </button>
                                    <span className="font-bold text-sm tracking-tight">{item.upvotes}</span>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusColor(item.status)}`}>
                                            {item.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.description}</p>
                                </div>
                            </div>
                        ))}
                        {feedback.length === 0 && (
                            <div className="col-span-2 text-center py-16">
                                <MessageSquarePlus className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No feedback yet</h3>
                                <p className="text-muted-foreground">Be the first to submit a feature idea!</p>
                            </div>
                        )}
                    </div>
                )}

                {!isAuthenticated && (
                    <div className="mt-8 p-8 glass-panel border border-border/50 rounded-3xl text-center bg-gradient-to-r from-background to-muted/20">
                        <MessageSquarePlus className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Have a brilliant idea?</h3>
                        <p className="text-muted-foreground mb-6">Log in to submit your feedback or vote on community suggestions.</p>
                        <button className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors">
                            Log In to Contribute
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
