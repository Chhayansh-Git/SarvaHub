"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import {
    Loader2, ArrowLeft, Package, Clock, Truck, CheckCircle, AlertTriangle,
    MapPin, CreditCard, MessageSquare, RotateCcw, ChevronRight
} from "lucide-react";

const STATUS_STEPS = ["confirmed", "processing", "shipped", "delivered"];

export default function SellerPurchaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await api.get<any>(`/orders/${params.id}`);
                setOrder(data.order || data);
            } catch (error) {
                console.error("Failed to load order:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [params.id]);

    const getStatusIndex = (status: string) => {
        const s = status?.toLowerCase();
        return STATUS_STEPS.indexOf(s);
    };

    const getStatusColor = (status: string) => {
        const s = status?.toLowerCase();
        if (s === "delivered") return "text-emerald-500";
        if (s === "shipped") return "text-blue-500";
        if (s === "cancelled") return "text-rose-500";
        return "text-amber-500";
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Order not found</h3>
                <button onClick={() => router.back()} className="text-accent font-semibold hover:underline">Go back</button>
            </div>
        );
    }

    const currentStepIndex = getStatusIndex(order.status);
    const isCancelled = order.status?.toLowerCase() === "cancelled";
    const isDelivered = order.status?.toLowerCase() === "delivered";

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            {/* Back Button */}
            <button onClick={() => router.push("/seller/purchases")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to My Purchases
            </button>

            {/* Order Header */}
            <div className="glass-panel rounded-3xl p-6 md:p-8 border-border/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Order ID</p>
                        <h1 className="text-2xl font-heading font-black font-mono">{(order._id || order.id || "").substring(0, 16).toUpperCase()}</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.status)} bg-current/10`}>
                        <span className="capitalize">{order.statusLabel || order.status}</span>
                    </div>
                </div>

                {/* Status Timeline */}
                {!isCancelled && (
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            {STATUS_STEPS.map((step, i) => {
                                const isActive = i <= currentStepIndex;
                                const isCurrent = i === currentStepIndex;
                                const icons: Record<string, any> = {
                                    confirmed: CheckCircle,
                                    processing: Clock,
                                    shipped: Truck,
                                    delivered: Package,
                                };
                                const Icon = icons[step] || Package;

                                return (
                                    <div key={step} className="flex flex-col items-center flex-1 relative">
                                        {i > 0 && (
                                            <div className={`absolute top-5 right-1/2 w-full h-0.5 -z-10 ${isActive ? "bg-accent" : "bg-border"}`} />
                                        )}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCurrent ? "border-accent bg-accent/10 scale-110" : isActive ? "border-accent bg-accent/5" : "border-border bg-muted"
                                            }`}>
                                            <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                                        </div>
                                        <p className={`text-xs font-bold mt-2 capitalize ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {isCancelled && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <AlertTriangle className="h-5 w-5 text-rose-500" />
                        <p className="text-sm font-medium text-rose-500">This order has been cancelled.</p>
                    </div>
                )}
            </div>

            {/* Order Items */}
            <div className="glass-panel rounded-3xl p-6 md:p-8 border-border/50">
                <h2 className="text-lg font-bold mb-4">Items Ordered</h2>
                <div className="space-y-4">
                    {(order.items || []).map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-background border border-border/50 hover:border-accent/20 transition-colors">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                                <Image
                                    src={item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"}
                                    alt={item.name || "Product"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold truncate">{item.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                                <p className="font-mono font-bold mt-1">₹{(item.price || 0).toLocaleString("en-IN")}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="glass-panel rounded-3xl p-6 border-border/50">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" /> Shipping Address
                    </h3>
                    <div className="text-sm space-y-1 text-muted-foreground">
                        <p>{order.shippingAddress?.line1 || order.shippingAddress?.street || "B2B Warehouse"}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                        <p>{order.shippingAddress?.pincode || order.shippingAddress?.zipCode}</p>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="glass-panel rounded-3xl p-6 border-border/50">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-accent" /> Payment Summary
                    </h3>
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-mono">₹{(order.subtotal || order.total || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="font-mono">{order.shipping > 0 ? `₹${order.shipping.toLocaleString("en-IN")}` : "Free"}</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 mt-2">
                            <span className="font-bold">Total</span>
                            <span className="font-mono font-bold text-lg">₹{(order.total || order.subtotal || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Payment: {order.paymentMethod?.brand || order.paymentMethod?.type || "B2B Credit Line"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            {isDelivered && (
                <div className="glass-panel rounded-3xl p-6 border-border/50">
                    <h3 className="font-bold mb-4">Need Help?</h3>
                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background hover:border-accent hover:text-accent transition-all text-sm font-semibold">
                            <RotateCcw className="h-4 w-4" /> Request Return
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background hover:border-accent hover:text-accent transition-all text-sm font-semibold">
                            <MessageSquare className="h-4 w-4" /> Raise Complaint
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
