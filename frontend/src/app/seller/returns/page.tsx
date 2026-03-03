"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Search, Filter, Eye, AlertCircle, Clock, Truck, ShieldCheck, RefreshCw, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface ReturnItem {
    id: string;
    orderId: string;
    customerName: string;
    items: { orderItemId: string; reason: string; resolution: string }[];
    status: string;
    createdAt: string;
}

export default function SellerReturnsPage() {
    const [filter, setFilter] = useState("All");
    const [returns, setReturns] = useState<ReturnItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get<{ returns: ReturnItem[] }>("/seller/returns");
                setReturns(res.returns || []);
            } catch {
                // empty
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filteredReturns = filter === "All" ? returns : returns.filter(r => r.status === filter.toLowerCase().replace(/ /g, '_'));

    const tabs = ["All", "Pending Approval", "Approved", "Pickup Scheduled", "Refund Processed"];
    const pending = returns.filter(r => r.status === 'pending_approval').length;
    const approved = returns.filter(r => r.status === 'approved').length;

    const statusLabel = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const statusColor = (s: string) => {
        if (s === 'pending_approval') return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        if (s === 'approved' || s === 'pickup_scheduled') return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
        if (s === 'refund_processed') return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        return 'bg-muted text-muted-foreground';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight text-foreground flex items-center gap-2">
                        <RefreshCw className="h-8 w-8 text-accent" />
                        Returns & Exchanges
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage incoming return requests, exchanges, and quality checks.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-muted-foreground font-medium">Action Required</p>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{pending}</p>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-muted-foreground font-medium">Approved</p>
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{approved}</p>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-muted-foreground font-medium">Total Returns</p>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{returns.length}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-px">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${filter === tab ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="glass-panel rounded-xl overflow-hidden border border-border/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/30 border-b border-border text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Return ID</th>
                                    <th className="p-4 font-medium">Order</th>
                                    <th className="p-4 font-medium">Customer</th>
                                    <th className="p-4 font-medium">Reason</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredReturns.map(req => (
                                    <tr key={req.id} className="hover:bg-muted/10 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-foreground">{req.id}</div>
                                            <div className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4 font-medium text-foreground">{req.orderId}</td>
                                        <td className="p-4 text-foreground">{req.customerName}</td>
                                        <td className="p-4">
                                            <div className="inline-flex items-center px-2 py-1 rounded-md bg-muted/30 text-xs font-medium text-foreground border border-border/50">
                                                {req.items?.[0]?.reason || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(req.status)}`}>
                                                {statusLabel(req.status)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-lg hover:bg-foreground/90 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                <Eye className="h-3.5 w-3.5" /> Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredReturns.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            No return requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
