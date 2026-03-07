"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { RefreshCcw, Package, Clock, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type TimelineStep = { step: string; completedAt: string | null };

type ReturnItem = {
    orderItemId: string;
    reason: string;
    subReason: string;
    resolution: string;
    exchangeVariantId: string | null;
    proofImages: string[];
    comments: string;
};

type ReturnRequest = {
    id: string;
    orderId: string;
    order?: {
        _id: string;
        itemCount: number;
        total: number;
        createdAt: string;
    };
    status: string;
    items: ReturnItem[];
    timeline: TimelineStep[];
    estimatedRefundDate: string | null;
    createdAt: string;
};

export default function ReturnsPage() {
    const { user, isAuthenticated } = useUserStore();
    const router = useRouter();
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        const fetchReturns = async () => {
            try {
                // The endpoint is /api/v1/orders/returns based on orderRoutes.ts definition
                const data = await api.get<{ returns: ReturnRequest[] }>('/orders/returns');
                setReturns(data.returns || []);
            } catch (error) {
                console.error("Failed to load returns", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReturns();
    }, [isAuthenticated, router]);

    if (!user) return null;

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending_approval': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock, label: 'Pending Approval' };
            case 'approved': return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: CheckCircle2, label: 'Approved' };
            case 'rejected': return { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle, label: 'Rejected' };
            case 'pickup_scheduled': return { color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Package, label: 'Pickup Scheduled' };
            case 'picked_up': return { color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: Package, label: 'Picked Up' };
            case 'inspecting': return { color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Clock, label: 'Inspecting' };
            case 'refund_processed': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2, label: 'Refund Processed' };
            default: return { color: 'text-muted-foreground', bg: 'bg-muted', icon: Clock, label: status.replace('_', ' ') };
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/account" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-heading font-black tracking-tight">Returns & Refunds</h1>
                        <p className="text-muted-foreground mt-1">Track the status of your current returns and past exchanges</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 glass-panel border border-border/50 rounded-3xl min-h-[400px]">
                        <Loader2 className="h-10 w-10 text-accent animate-spin mb-4" />
                        <p className="text-muted-foreground font-medium">Loading your return history...</p>
                    </div>
                ) : returns.length === 0 ? (
                    <div className="text-center p-20 glass-panel border border-border/50 rounded-3xl min-h-[400px] flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                            <RefreshCcw className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No Returns Found</h3>
                        <p className="text-muted-foreground max-w-sm mb-8">
                            You haven't requested any returns, refunds, or exchanges yet. Active orders eligible for return will appear in your Orders section.
                        </p>
                        <Link href="/account/orders" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent hover:text-white transition-all">
                            View My Orders
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {returns.map((ret) => {
                            const statusInfo = getStatusInfo(ret.status);
                            const activeStepIndex = ret.timeline.reduce((lastIdx, t, idx) => t.completedAt ? idx : lastIdx, 0);

                            return (
                                <div key={ret.id} className="glass-panel border border-border/50 rounded-3xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                                Return ID: {ret.id}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold">Ordered on {new Date(ret.order?.createdAt || ret.createdAt).toLocaleDateString()}</h3>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 block w-max ${statusInfo.bg} ${statusInfo.color}`}>
                                                    <statusInfo.icon className="h-3 w-3" />
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="sm:text-right">
                                            <p className="text-sm text-muted-foreground">Original Order</p>
                                            <Link href={`/account/orders`} className="text-accent font-bold hover:underline">
                                                #{ret.orderId.substring(0, 8).toUpperCase()}
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Return Details */}
                                    <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-border/50">
                                        <div>
                                            <h4 className="font-semibold mb-4 text-muted-foreground text-sm uppercase tracking-wide">Return Items</h4>
                                            <div className="space-y-4">
                                                {ret.items.map((item, idx) => (
                                                    <div key={idx} className="flex gap-4">
                                                        <div className="w-16 h-16 bg-muted rounded-xl border border-border shrink-0 flex items-center justify-center">
                                                            <Package className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm line-clamp-2 mb-1">Item ID: {item.orderItemId.substring(0, 8).toUpperCase()}</p>
                                                            <p className="text-xs text-muted-foreground mb-2">Reason: {item.reason} {item.subReason && ` - ${item.subReason}`}</p>
                                                            <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded-full uppercase tracking-wider">
                                                                {item.resolution.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status Timeline */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-muted-foreground text-sm uppercase tracking-wide">Return Status</h4>
                                            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:left-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-border/50">
                                                {ret.timeline.filter(t => t.completedAt || ret.timeline.indexOf(t) === activeStepIndex + 1).map((step, idx) => {
                                                    const isCompleted = !!step.completedAt;
                                                    const isActive = idx === activeStepIndex;

                                                    return (
                                                        <div key={idx} className="relative z-10">
                                                            <div className={`absolute -left-8 mt-1 h-4 w-4 rounded-full border-2 ${isCompleted ? 'bg-emerald-500 border-emerald-500' : isActive ? 'bg-background border-accent shadow-[0_0_0_4px_rgba(202,138,4,0.1)]' : 'bg-background border-border'} transition-colors`} />
                                                            <div>
                                                                <p className={`font-semibold text-sm ${isActive ? 'text-accent' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                                    {step.step}
                                                                </p>
                                                                {isCompleted && step.completedAt && (
                                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                                        {new Date(step.completedAt).toLocaleString()}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {ret.estimatedRefundDate && (
                                                <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-xl">
                                                    <p className="text-sm font-semibold text-accent/80 mb-1">Estimated Refund Date</p>
                                                    <p className="text-lg font-bold text-accent">{new Date(ret.estimatedRefundDate).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Footers */}
                                    <div className="pt-6 flex justify-between items-center bg-background/50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 px-6 sm:px-8 pb-6 sm:pb-8 rounded-b-3xl">
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            Need help with this return?
                                            <Link href="/support" className="text-primary font-bold hover:underline">Contact Support</Link>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
