import { Users, MessagesSquare, Award, ArrowUpRight } from "lucide-react";

export default function SellerCommunityPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Forum & Networking</span>
                    <h1 className="text-3xl font-heading font-black tracking-tight mb-2">
                        Seller Community
                    </h1>
                    <p className="text-muted-foreground text-sm">Join the discussion, share strategies, and learn from top-tier merchants.</p>
                </div>
                <button className="px-6 py-3 bg-foreground text-background font-bold rounded-xl shadow-lg hover:bg-primary hover:-translate-y-0.5 transition-all self-start md:self-auto flex items-center gap-2">
                    <MessagesSquare className="h-4 w-4" /> Start Discussion
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Main Forum Feed */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Simulated Threads */}
                    {[
                        { title: "Best courier service for international luxury watch shipping?", author: "TimepieceVault", replies: 24, views: 1205, time: "2 hours ago", pinned: true },
                        { title: "Update: New Category Fees effective Nov 2026", author: "SarvaHub Staff", replies: 89, views: 5400, time: "1 day ago", pinned: true },
                        { title: "Dealing with false 'Counterfeit' claims - Advice needed", author: "LuxBoutique", replies: 12, views: 340, time: "4 hours ago", pinned: false },
                        { title: "Professional photography tips for used handbags", author: "VintageChic", replies: 31, views: 890, time: "Yesterday", pinned: false },
                        { title: "Q3 Sales Trends: Are electronics slowing down?", author: "TechHaven", replies: 5, views: 150, time: "2 days ago", pinned: false },
                    ].map((thread, i) => (
                        <div key={i} className={`p-5 rounded-2xl border transition-colors cursor-pointer group hover:border-accent/40 ${thread.pinned ? 'bg-accent/5 border-accent/20' : 'glass-panel border-border/50'}`}>
                            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                                <h3 className="text-lg font-bold group-hover:text-accent transition-colors">
                                    {thread.pinned && <span className="text-xs uppercase tracking-wider font-extrabold text-accent mr-2">📌 Pinned:</span>}
                                    {thread.title}
                                </h3>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <span className={`font-medium ${thread.author === 'SarvaHub Staff' ? 'text-foreground' : ''}`}>{thread.author}</span>
                                    <span>•</span>
                                    <span>{thread.time}</span>
                                </div>
                                <div className="flex items-center gap-4 font-medium">
                                    <span>{thread.replies} Replies</span>
                                    <span>{thread.views} Views</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="w-full py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors glass-panel rounded-2xl border border-border/50 mt-4">
                        Load More Topics...
                    </button>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-border/50">
                        <Users className="h-6 w-6 mb-4 text-accent" />
                        <h3 className="font-bold mb-2">Community Guidelines</h3>
                        <p className="text-sm text-muted-foreground mb-4">Be respectful, share actionable insights, and refrain from self-promotion outside of designated threads.</p>
                        <span className="text-xs font-bold uppercase tracking-wider text-accent cursor-pointer hover:underline flex items-center gap-1">Read Full Rules <ArrowUpRight className="h-3 w-3" /></span>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-border/50">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <Award className="h-5 w-5 text-yellow-500" />
                            <h3 className="font-bold">Top Contributors</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: "VintageChic", posts: 420 },
                                { name: "TimepieceVault", posts: 385 },
                                { name: "LuxEmporium", posts: 312 },
                            ].map((user, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">{i + 1}</div>
                                        <span className="text-sm font-semibold">{user.name}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{user.posts} posts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
