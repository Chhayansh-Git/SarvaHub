"use client";

import { useUserStore } from "@/store/userStore";
import { MessageSquarePlus, ChevronUp, Search, Filter } from "lucide-react";

const mockFeedback = [
    { id: 1, title: "Dark Mode for iOS App", desc: "It would be great if the mobile app supported native dark mode styling.", status: "In Progress", upvotes: 1240 },
    { id: 2, estimated_release: "Q3 2026", title: "Apple Pay Integration", desc: "Faster checkout using Apple Pay instead of manually entering card details.", status: "Planned", upvotes: 890 },
    { id: 3, title: "Gift Wrapping Options", desc: "Add an option during checkout to add premium gift wrap with a custom note.", status: "Under Review", upvotes: 654 },
    { id: 4, title: "Search by Image", desc: "Allow users to upload an image to find visually similar items.", status: "Completed", upvotes: 2100 },
];

export default function GeneralFeedbackPage() {
    const { isAuthenticated } = useUserStore();

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs tracking-widest uppercase mb-4 inline-block">
                        Community Voice
                    </span>
                    <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter mb-4">
                        Shape the Future of SarvaHub
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We build for you. Propose new features, upvote existing ideas, and track what our engineering team is building next.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search existing feedback..."
                            className="w-full bg-glass border border-border/50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent shadow-sm"
                        />
                    </div>

                    <button className="px-6 py-4 bg-background border border-border/50 rounded-2xl hover:border-accent text-sm font-bold transition-colors flex items-center justify-center gap-2">
                        <Filter className="h-4 w-4" /> Filter by Status
                    </button>

                    <button className="px-8 py-4 bg-foreground text-background font-bold rounded-2xl hover:bg-primary transition-colors hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 shrink-0">
                        <MessageSquarePlus className="h-5 w-5" /> Submit Idea
                    </button>
                </div>

                {/* Feedback Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                    {mockFeedback.map((item, idx) => (
                        <div key={item.id} className="glass-panel p-6 rounded-3xl border border-border/50 hover:border-accent/40 transition-colors flex gap-5 group">

                            {/* Upvote Button */}
                            <div className="flex flex-col items-center gap-1 shrink-0">
                                <button className="p-2 border border-border/50 rounded-xl hover:bg-accent hover:border-accent hover:text-accent-foreground text-muted-foreground transition-all group-hover:shadow-md">
                                    <ChevronUp className="h-6 w-6 font-bold" />
                                </button>
                                <span className="font-bold text-sm tracking-tight">{item.upvotes}</span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'Completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            item.status === 'In Progress' ? 'bg-accent/10 border-accent/20 text-accent' :
                                                item.status === 'Planned' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    'bg-muted text-muted-foreground'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Engagement Banner */}
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
