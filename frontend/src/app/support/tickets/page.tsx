"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Clock, MessageSquare, AlertCircle, CheckCircle, ChevronRight, Hash, Loader2 } from "lucide-react";

export default function SupportTicketsPage() {
    const [filter, setFilter] = useState("Open");
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const { api } = await import('@/lib/api');
                const data = await api.get<any>('/support/tickets');
                const ticketList = Array.isArray(data) ? data : (data.tickets || []);

                if (ticketList.length > 0) {
                    setTickets(ticketList);
                } else {
                    throw new Error("Empty tickets, use fallback");
                }
            } catch (error) {
                // Fallback to mock data
                setTickets([
                    { id: "TCK-A8F29C", subject: "Refund not received yet", category: "Refunds", status: "Open", priority: "High", assignedTo: "Support Team", lastUpdated: "10 mins ago" },
                    { id: "TCK-B3D55X", subject: "Update shipping address", category: "Orders", status: "Open", priority: "Medium", assignedTo: "Logistics", lastUpdated: "2 hours ago" },
                    { id: "TCK-M9N11Z", subject: "Product damaged on arrival", category: "Returns", status: "Awaiting Reply", priority: "High", assignedTo: "Quality Control", lastUpdated: "1 day ago" },
                    { id: "TCK-X7Y44P", subject: "Discount code not working", category: "Payments", status: "Resolved", priority: "Low", assignedTo: "Billing", lastUpdated: "3 days ago" },
                ]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTickets();
    }, []);

    const filteredTickets = filter === "All" ? tickets : tickets.filter(t =>
        filter === "Awaiting Reply" ? t.status === "Awaiting Reply" :
            filter === "Resolved" ? t.status === "Resolved" :
                t.status === "Open"
    );

    const tabs = ["All", "Open", "Awaiting Reply", "Resolved"];

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-black tracking-tight text-foreground flex items-center gap-3">
                            <MessageSquare className="h-8 w-8 text-accent" />
                            My Support Tickets
                        </h1>
                        <p className="text-muted-foreground mt-2">Track your active inquiries or start a new conversation with our team.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full font-bold text-sm hover:bg-foreground/90 transition-transform active:scale-95 whitespace-nowrap">
                        <Plus className="h-4 w-4" /> New Ticket
                    </button>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-panel p-6 rounded-2xl border border-border/50 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Open Tickets</p>
                            <p className="text-3xl font-bold text-foreground">2</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-border/50 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Awaiting Your Reply</p>
                            <p className="text-3xl font-bold text-foreground">1</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-border/50 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Resolved (Past 30 Days)</p>
                            <p className="text-3xl font-bold text-foreground">4</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${filter === tab
                                    ? 'bg-foreground text-background'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="w-full sm:w-64 bg-background border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                        />
                    </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 text-center text-muted-foreground animate-pulse glass-panel rounded-2xl border border-border/50">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
                            Loading your tickets...
                        </div>
                    ) : filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket) => (
                            <div key={ticket.id} className="glass-panel p-5 rounded-2xl border border-border/50 hover:border-accent/50 transition-colors group cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                    <Hash className="h-6 w-6 text-muted-foreground" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-base font-bold text-foreground truncate">{ticket.subject}</h3>
                                        {ticket.priority === 'High' && (
                                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                                Priority
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                        <span>{ticket.id}</span>
                                        <span className="h-1 w-1 rounded-full bg-border"></span>
                                        <span>{ticket.category}</span>
                                        <span className="h-1 w-1 rounded-full bg-border"></span>
                                        <span>Updated {ticket.lastUpdated}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48 flex-shrink-0 border-t border-border/50 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${ticket.status === 'Open' ? 'bg-amber-500/10 text-amber-500' :
                                        ticket.status === 'Awaiting Reply' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                        {ticket.status === 'Open' && <AlertCircle className="h-3.5 w-3.5" />}
                                        {ticket.status === 'Awaiting Reply' && <Clock className="h-3.5 w-3.5" />}
                                        {ticket.status === 'Resolved' && <CheckCircle className="h-3.5 w-3.5" />}
                                        {ticket.status}
                                    </span>

                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 glass-panel rounded-2xl border border-border/50">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-emerald-500 opacity-50" />
                            <h3 className="text-lg font-bold text-foreground mb-1">All Caught Up!</h3>
                            <p className="text-muted-foreground">No tickets found for this status.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
