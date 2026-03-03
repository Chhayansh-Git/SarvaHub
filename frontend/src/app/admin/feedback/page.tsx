"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquare, ThumbsUp, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedback = async () => {
        try {
            const data = await api.get<any>('/admin/feedback');
            setFeedback(data.feedback || []);
        } catch {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/feedback/${id}`, { status: newStatus });
            fetchFeedback();
        } catch {
            // Handle error
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-heading font-black tracking-tight">Feedback Review</h1>
                <p className="text-muted-foreground mt-1">Review top-voted features requested by your community.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {feedback.map(item => (
                        <div key={item._id} className="glass-panel p-6 rounded-3xl border border-border/50 flex flex-col h-full">
                            <div className="flex gap-4 mb-4">
                                <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-accent/5 border border-accent/20 shrink-0">
                                    <ChevronUp className="h-5 w-5 text-accent mb-0.5" />
                                    <span className="text-xs font-bold text-accent">{item.upvotes}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight mb-1">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground">By {item.authorId?.name || 'Anonymous'} • {new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-3">
                                {item.description}
                            </p>

                            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status:</span>
                                <select
                                    className="bg-background border border-border/50 rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:border-accent capitalize"
                                    value={item.status}
                                    onChange={(e) => updateStatus(item._id, e.target.value)}
                                >
                                    <option value="under_review">Under Review</option>
                                    <option value="planned">Planned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="declined">Declined</option>
                                </select>
                            </div>
                        </div>
                    ))}

                    {feedback.length === 0 && (
                        <div className="col-span-2 glass-panel p-12 rounded-3xl border border-border/50 text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No feedback found</h3>
                            <p className="text-muted-foreground">Your community hasn't submitted any feedback yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
