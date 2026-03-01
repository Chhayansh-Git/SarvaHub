"use client";

import { useState } from "react";
import { CheckCircle, Search, Filter, Eye, AlertCircle, Clock, Truck, ShieldCheck, RefreshCw } from "lucide-react";

export default function SellerReturnsPage() {
    const [filter, setFilter] = useState("Pending");

    const returns = [
        { id: "RET-OYYBY8BP", orderId: "ORD-12345", customer: "John Doe", items: 1, amount: 840000, date: "2023-10-24", reason: "Changed mind", resolution: "Store Credit", status: "Pending", priority: "High" },
        { id: "RET-XZY123AB", orderId: "ORD-67890", customer: "Alice Smith", items: 2, amount: 45000, date: "2023-10-23", reason: "Defective/Damaged", resolution: "Refund", status: "In Transit" },
        { id: "RET-POI098LK", orderId: "ORD-54321", customer: "Bob Johnson", items: 1, amount: 12000, date: "2023-10-22", reason: "Wrong size/fit", resolution: "Exchange", status: "Quality Check" },
        { id: "RET-MNB456VF", orderId: "ORD-98765", customer: "Emma Davis", items: 1, amount: 3500, date: "2023-10-20", reason: "Not as described", resolution: "Refund", status: "Completed" }
    ];

    const filteredReturns = filter === "All" ? returns : returns.filter(r => r.status === filter);

    const tabs = ["All", "Pending", "In Transit", "Quality Check", "Completed", "Rejected"];

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
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-muted-foreground font-medium">Action Required</p>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-muted-foreground font-medium">In Transit</p>
                        <Truck className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-muted-foreground font-medium">Quality Check</p>
                        <ShieldCheck className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">4</p>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-muted-foreground font-medium">Completed (This Month)</p>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">45</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-px">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${filter === tab ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Quick Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by Return ID, Order ID, or Customer..."
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                />
            </div>

            {/* Returns Table */}
            <div className="glass-panel rounded-xl overflow-hidden border border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30 border-b border-border text-muted-foreground">
                            <tr>
                                <th className="p-4 font-medium">Return ID</th>
                                <th className="p-4 font-medium">Order details</th>
                                <th className="p-4 font-medium">Resolution</th>
                                <th className="p-4 font-medium">Reason</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredReturns.map((req) => (
                                <tr key={req.id} className="hover:bg-muted/10 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-foreground inline-flex items-center gap-2">
                                            {req.priority === 'High' && <div className="w-2 h-2 rounded-full bg-amber-500" title="High Priority"></div>}
                                            {req.id}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{req.date}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-foreground">{req.orderId}</div>
                                        <div className="text-xs text-muted-foreground">{req.customer} • {req.items} item(s)</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-foreground">{req.resolution}</div>
                                        <div className="text-xs text-muted-foreground">₹{req.amount.toLocaleString('en-IN')}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-muted/30 text-xs font-medium text-foreground border border-border/50">
                                            {req.reason}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                req.status === 'In Transit' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                    req.status === 'Quality Check' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                                                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            }`}>
                                            {req.status === 'Pending' && <Clock className="h-3 w-3" />}
                                            {req.status === 'In Transit' && <Truck className="h-3 w-3" />}
                                            {req.status === 'Quality Check' && <ShieldCheck className="h-3 w-3" />}
                                            {req.status === 'Completed' && <CheckCircle className="h-3 w-3" />}
                                            {req.status}
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
                                        No return requests found in this view.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

