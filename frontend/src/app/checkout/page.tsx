"use client";

import { useState } from "react";
import { Check, ChevronRight, ShieldCheck, Lock, CreditCard } from "lucide-react";
import Image from "next/image";

// Dummy order summary
const orderItems = [
    { id: 1, name: "Chronograph Automatic 42mm", price: 205800, qty: 1, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&q=80" },
    { id: 2, name: "Aetherius Obsidian Ring", price: 74760, qty: 2, image: "https://images.unsplash.com/photo-1605100804763-247f673f224e?w=200&q=80" }
];

const subtotal = 355320;
const shipping = 0; // Free express shipping tier
const taxes = 63957.60; // Approx 18% GST
const total = subtotal + shipping + taxes;

export default function CheckoutPage() {
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

    return (
        <div className="min-h-screen pt-24 pb-20 bg-muted/20">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Checkout Header / Breadcrumbs */}
                <div className="flex items-center justify-center gap-4 mb-12 text-sm font-semibold">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-foreground text-background' : 'bg-muted'}`}>1</div>
                        Shipping
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-foreground text-background' : 'bg-muted'}`}>2</div>
                        Payment
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <div className={`flex items-center gap-2 ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-foreground text-background' : 'bg-muted'}`}>3</div>
                        Verification
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Main Form Area */}
                    <div className="w-full lg:w-3/5">
                        {step === 1 && (
                            <div className="glass-panel p-8 rounded-3xl border-glass-border shadow-sm">
                                <h2 className="text-2xl font-heading font-bold mb-6">Shipping Details</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <input type="text" className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" defaultValue="Aarav" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <input type="text" className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" defaultValue="Sharma" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input type="email" className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" defaultValue="aarav.sharma@example.in" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Shipping Address</label>
                                        <input type="text" className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="123 Luxury Ave, Bandra West" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1 space-y-2">
                                            <label className="text-sm font-medium">PIN Code</label>
                                            <input type="text" className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="400050" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-medium">City</label>
                                            <input type="text" className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="Mumbai" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full py-4 mt-4 bg-foreground text-background font-bold text-lg rounded-xl flex items-center justify-center hover:bg-primary transition-colors shadow-lg"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="glass-panel p-8 rounded-3xl border-glass-border shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-heading font-bold">Secure Payment</h2>
                                    <div className="flex gap-2">
                                        <Lock className="h-5 w-5 text-emerald-500" />
                                        <span className="text-sm font-semibold text-emerald-500">256-bit Encrypted</span>
                                    </div>
                                </div>

                                {/* Payment Method Selector */}
                                <div className="space-y-4 mb-8">
                                    <label className="flex items-center gap-4 p-4 border-2 border-accent rounded-xl cursor-pointer bg-accent/5">
                                        <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-accent border-gray-300 focus:ring-accent" />
                                        <span className="font-semibold">Credit Card / UPI</span>
                                        <div className="ml-auto flex gap-2">
                                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-4 p-4 border border-border rounded-xl cursor-pointer hover:border-accent/50 transition-colors">
                                        <input type="radio" name="payment" className="w-4 h-4 text-accent border-gray-300 focus:ring-accent" />
                                        <span className="font-semibold">Crypto / Web3</span>
                                        <div className="ml-auto flex gap-2">
                                            <div className="text-xs font-bold border rounded px-1 flex items-center h-6">Web3</div>
                                        </div>
                                    </label>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Card Number / UPI ID</label>
                                        <input type="text" className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all font-mono" placeholder="4111 1111 1111 1111" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Expiry</label>
                                            <input type="text" className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all font-mono" placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">CVV</label>
                                            <input type="text" className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all font-mono" placeholder="123" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="w-full py-4 mt-8 bg-foreground text-background font-bold text-lg rounded-xl flex items-center justify-center hover:bg-primary transition-colors shadow-lg"
                                    >
                                        Pay ₹{(total).toLocaleString('en-IN')}
                                    </button>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full py-2 mt-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Back to Shipping
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="glass-panel p-12 rounded-3xl border-glass-border shadow-sm text-center flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                                    <Check className="h-10 w-10 text-emerald-500" />
                                </div>
                                <h2 className="text-3xl font-heading font-black mb-4">Order Confirmed!</h2>
                                <p className="text-muted-foreground mb-8 max-w-sm">
                                    Your order <span className="font-bold text-foreground">#SVH-8921-X</span> has been successfully placed. We&apos;ve sent a verification receipt to your email.
                                </p>

                                <div className="bg-muted p-6 rounded-2xl w-full max-w-sm text-left mb-8 border border-border">
                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 text-accent" /> Authenticity Verification
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        The items in your order will now undergo a final 12-point authentication screening before dispatch. You can track this process live in your dashboard.
                                    </p>
                                </div>

                                <button className="py-3 px-8 bg-foreground text-background font-bold rounded-xl flex items-center justify-center hover:bg-primary transition-colors">
                                    View Order Status
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-2/5">
                        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-glass-border shadow-sm sticky top-28">
                            <h3 className="text-xl font-heading font-bold mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 custom-scrollbar max-h-[40vh] overflow-y-auto pr-2">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-sm text-muted-foreground">Qty: {item.qty}</span>
                                                <span className="font-bold text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 py-6 border-y border-border mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-semibold text-emerald-500">Free Express</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Estimated GST</span>
                                    <span className="font-medium">₹{taxes.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold">Total</span>
                                <div className="text-right">
                                    <span className="text-xs text-muted-foreground block mb-1">INR</span>
                                    <span className="text-3xl font-mono font-black">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
