"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import {
    ArrowLeft, ChevronRight, Check, Loader2, Lock, CreditCard,
    ShieldCheck, MapPin, Truck, Package, Building2
} from "lucide-react";

type ProductDetail = {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images: { url: string; alt?: string }[];
    category: string;
    seller: { name: string; companyName: string };
};

function SellerCheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useUserStore();

    const productId = searchParams.get("productId");
    const qty = parseInt(searchParams.get("qty") || "1", 10);

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment & Review, 3: Success
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    // Shipping form state — pre-fill from seller profile
    const [shippingData, setShippingData] = useState({
        recipientName: "",
        warehouseName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
    });

    const [paymentMethod, setPaymentMethod] = useState<"credit_line" | "card">("credit_line");

    // Load product data
    useEffect(() => {
        if (!productId) {
            router.replace("/seller/market");
            return;
        }
        const fetchProduct = async () => {
            try {
                const res = await api.get<{ product: ProductDetail }>(`/seller/market/${productId}`);
                setProduct(res.product);
            } catch (error) {
                console.error("Failed to fetch product for checkout", error);
                router.replace("/seller/market");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId, router]);

    // Pre-fill shipping from seller profile
    useEffect(() => {
        if (user?.sellerProfile) {
            const p = user.sellerProfile;
            setShippingData((prev) => ({
                ...prev,
                recipientName: p.contactPerson?.name || user.name || "",
                warehouseName: p.businessName || "",
                addressLine1: p.registeredAddress?.line1 || p.location || "",
                city: p.registeredAddress?.city || "",
                state: p.registeredAddress?.state || "",
                pincode: p.registeredAddress?.pincode || "",
                phone: p.contactPerson?.phone || p.contactPhone || "",
            }));
        }
    }, [user]);

    // Pricing
    const subtotal = useMemo(() => (product?.price || 0) * qty, [product, qty]);
    const shipping = subtotal >= 2000 ? 0 : 149;
    const taxes = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
    const total = useMemo(() => subtotal + shipping + taxes, [subtotal, shipping, taxes]);

    const handleContinueToReview = () => {
        if (!shippingData.recipientName || !shippingData.addressLine1 || !shippingData.city || !shippingData.state || !shippingData.pincode || !shippingData.phone) {
            alert("Please fill out all shipping fields.");
            return;
        }
        if (!/^\d{6}$/.test(shippingData.pincode)) {
            alert("Please enter a valid 6-digit PIN code.");
            return;
        }
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            const data = await api.post<{ order: any }>("/orders/b2b", {
                productId: product!._id,
                quantity: qty,
                shippingAddress: {
                    line1: `${shippingData.warehouseName ? shippingData.warehouseName + ", " : ""}${shippingData.addressLine1}`,
                    line2: shippingData.addressLine2,
                    city: shippingData.city,
                    state: shippingData.state,
                    pincode: shippingData.pincode,
                },
            });
            setOrderId(data.order?._id || data.order?.id || "PENDING");
            setStep(3);
        } catch (error: any) {
            alert(error.message || "Failed to place the order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
            </div>
        );
    }

    if (!product) return null;

    const productImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            {/* Back Button */}
            <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Market
            </button>

            <h1 className="text-3xl font-heading font-black tracking-tight">B2B Order Checkout</h1>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
                {[
                    { id: 1, label: "Shipping", icon: MapPin },
                    { id: 2, label: "Review & Pay", icon: CreditCard },
                    { id: 3, label: "Confirmed", icon: Check },
                ].map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.id ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground border border-border"}`}>
                            {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                        </div>
                        <span className={`text-sm font-bold hidden sm:block ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                        {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Step 1: Shipping */}
                    {step === 1 && (
                        <div className="glass-panel rounded-3xl p-6 md:p-8 border-border/50 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                                <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Shipping / Warehouse Address</h2>
                                    <p className="text-sm text-muted-foreground">Where should we deliver this B2B order?</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">Recipient Name *</label>
                                    <input type="text" value={shippingData.recipientName} onChange={(e) => setShippingData({ ...shippingData, recipientName: e.target.value })} className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">Warehouse / Store Name</label>
                                    <input type="text" value={shippingData.warehouseName} onChange={(e) => setShippingData({ ...shippingData, warehouseName: e.target.value })} className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="HQ Warehouse" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">Address Line 1 *</label>
                                <input type="text" value={shippingData.addressLine1} onChange={(e) => setShippingData({ ...shippingData, addressLine1: e.target.value })} className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="Building name, Street, Locality" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">Address Line 2</label>
                                <input type="text" value={shippingData.addressLine2} onChange={(e) => setShippingData({ ...shippingData, addressLine2: e.target.value })} className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="Landmark (Optional)" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">City *</label>
                                    <input type="text" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="Mumbai" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">State *</label>
                                    <input type="text" value={shippingData.state} onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })} className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="Maharashtra" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">PIN Code *</label>
                                    <input type="text" maxLength={6} value={shippingData.pincode} onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value.replace(/\D/g, '') })} className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono" placeholder="400001" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">Contact Phone *</label>
                                <input type="tel" value={shippingData.phone} onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })} className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="+91 98765 43210" required />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button onClick={handleContinueToReview} className="px-8 py-3 bg-foreground text-background font-bold rounded-xl flex items-center gap-2 hover:bg-accent hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                    Continue to Review <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Payment & Review */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Shipping Summary */}
                            <div className="glass-panel rounded-3xl p-6 border-border/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Delivering To</h3>
                                    <button onClick={() => setStep(1)} className="text-sm text-accent font-semibold hover:underline">Edit</button>
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p className="font-semibold text-foreground">{shippingData.recipientName}</p>
                                    {shippingData.warehouseName && <p>{shippingData.warehouseName}</p>}
                                    <p>{shippingData.addressLine1}{shippingData.addressLine2 ? `, ${shippingData.addressLine2}` : ""}</p>
                                    <p>{shippingData.city}, {shippingData.state} — {shippingData.pincode}</p>
                                    <p>Phone: {shippingData.phone}</p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="glass-panel rounded-3xl p-6 border-border/50">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-accent" /> Payment Method</h3>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "credit_line" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-muted-foreground"}`}>
                                        <input type="radio" name="payment" checked={paymentMethod === "credit_line"} onChange={() => setPaymentMethod("credit_line")} className="w-4 h-4 text-accent" />
                                        <div className="flex-1">
                                            <span className="font-bold block text-sm">B2B Credit Line / Net Banking</span>
                                            <span className="text-xs text-muted-foreground">Pay via your verified seller account credit facility.</span>
                                        </div>
                                        <Building2 className="w-5 h-5 text-muted-foreground" />
                                    </label>
                                    <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "card" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-muted-foreground"}`}>
                                        <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="w-4 h-4 text-accent" />
                                        <div className="flex-1">
                                            <span className="font-bold block text-sm">Credit / Debit Card</span>
                                            <span className="text-xs text-muted-foreground">Standard card payment with 2.9% processing fee.</span>
                                        </div>
                                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                                <button onClick={() => setStep(1)} className="px-6 py-3 font-semibold rounded-xl glass-panel hover:bg-muted text-foreground">Back</button>
                                <button onClick={handlePlaceOrder} disabled={isProcessing} className="px-8 py-3 bg-accent text-accent-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50">
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString()} & Confirm`}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="glass-panel rounded-3xl p-8 md:p-12 border-border/50 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                <Check className="h-12 w-12 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-heading font-black mb-3">Order Confirmed!</h2>
                            <p className="text-muted-foreground mb-2">Your B2B purchase order has been successfully placed.</p>
                            {orderId && orderId !== "PENDING" && (
                                <p className="text-sm font-mono text-accent font-bold mb-6">Order ID: {orderId.substring(0, 12).toUpperCase()}</p>
                            )}
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <button onClick={() => router.push("/seller/purchases")} className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-accent hover:text-white transition-all shadow-lg">
                                    View My Purchases
                                </button>
                                <button onClick={() => router.push("/seller/market")} className="px-6 py-3 glass-panel font-semibold rounded-xl hover:bg-muted transition-colors">
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                {step !== 3 && (
                    <div className="space-y-6">
                        <div className="glass-panel rounded-3xl p-6 border-border/50 sticky top-28">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-accent" /> Order Summary
                            </h3>

                            {/* Product */}
                            <div className="flex gap-4 mb-6 pb-6 border-b border-border/50">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                                    <Image src={productImage} alt={product.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {qty}</p>
                                    <p className="font-bold font-mono mt-1">₹{product.price.toLocaleString()} × {qty}</p>
                                </div>
                            </div>

                            {/* Pricing Breakdown */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-mono">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className={`font-mono ${shipping === 0 ? "text-emerald-500 font-bold" : ""}`}>
                                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">GST (18%)</span>
                                    <span className="font-mono">₹{taxes.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-border/50 border-dashed">
                                    <span className="font-bold text-base">Total</span>
                                    <span className="font-black font-mono text-lg">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-6 pt-6 border-t border-border/50 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    Authenticated & inspected before dispatch
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Lock className="w-3.5 h-3.5 text-accent" />
                                    Secure B2B transaction
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SellerCheckoutPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-12 w-12 text-accent animate-spin" /></div>}>
            <SellerCheckoutContent />
        </Suspense>
    );
}
