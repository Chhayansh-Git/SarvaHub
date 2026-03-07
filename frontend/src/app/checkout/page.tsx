"use client";

import { useState, useMemo } from "react";
import { Check, ChevronRight, ShieldCheck, Lock, CreditCard, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    const { items, subtotal, clearCart } = useCartStore();
    const { user, setUser } = useUserStore();

    const shipping = subtotal >= 499 ? 0 : 49; // Free above ₹499
    const taxes = useMemo(() => Math.round(subtotal * 0.18 * 100) / 100, [subtotal]); // 18% GST
    const total = useMemo(() => subtotal + shipping + taxes, [subtotal, taxes]);

    // Shipping form state
    const [shippingData, setShippingData] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        address: '',
        pincode: '',
        city: '',
    });

    // Verification Modal State
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    const placeOrderCall = async (verificationCode?: string) => {
        setIsProcessing(true);
        try {
            const payload: any = {
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                })),
                shippingAddress: {
                    firstName: shippingData.firstName,
                    lastName: shippingData.lastName,
                    email: shippingData.email,
                    address: shippingData.address,
                    pincode: shippingData.pincode,
                    city: shippingData.city,
                },
            };

            if (verificationCode) {
                payload.verificationCode = verificationCode;
            }

            const data = await api.post<{ orderId: string; order: any }>('/checkout/intent', payload);
            setOrderId(data.orderId || data.order?._id || 'PENDING');
            clearCart();
            // Optional: If user verified via checkout, optimistic update their verified status in local store
            if (verificationCode && user) {
                setUser({ ...user, isEmailVerified: true });
            }
            setStep(3);
            setShowVerificationModal(false);
        } catch (error: any) {
            alert(error.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!shippingData.firstName || !shippingData.lastName || !shippingData.address || !shippingData.city || !shippingData.email || !shippingData.pincode) {
            alert('Please fill out all shipping fields.');
            setStep(1);
            return;
        }

        // Before placing order, if user is logged in but unverified, prompt OTP
        // Or if they are guest, but we want to verify the email they provided.
        // The backend `requireVerification` logic will throw an error if missing, 
        // but we can proactively trigger it here if configured.
        const isVerified = user?.isEmailVerified || user?.isPhoneVerified;

        // For security, if they are not verified, show the OTP modal
        if (user && !isVerified) {
            sendVerificationOtp();
            setShowVerificationModal(true);
            return;
        }

        // Proceed normally
        await placeOrderCall();
    };

    const sendVerificationOtp = async () => {
        setIsSendingOtp(true);
        try {
            await api.post('/auth/send-otp', {
                identifier: shippingData.email || user?.email,
                channel: 'email'
            });
            // Don't show success alert to not interrupt flow, modal opens
        } catch (error: any) {
            alert("Failed to send verification email. " + (error.message || ""));
            setShowVerificationModal(false); // abort
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtpAndPlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifyingOtp(true);
        try {
            // Can hit /auth/verify-otp if it marks user as verified, or just pass code to /checkout/intent
            // backend /checkout/intent checks the OTP if `verificationCode` is present
            await placeOrderCall(otpCode);
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleContinueToPayment = () => {
        if (!shippingData.firstName || !shippingData.lastName || !shippingData.address || !shippingData.city || !shippingData.email || !shippingData.pincode) {
            alert('Please fill out all shipping fields.');
            return;
        }
        if (!/^\d{6}$/.test(shippingData.pincode)) {
            alert('Please enter a valid 6-digit PIN code.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(shippingData.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        setStep(2);
    };

    // Redirect if cart is empty and not on success step
    if (items.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen pt-24 pb-20 bg-muted/20">
                <div className="container mx-auto px-4 max-w-6xl text-center py-20">
                    <h2 className="text-2xl font-heading font-bold mb-4">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-8">Add some items before checking out.</p>
                    <button onClick={() => router.push('/search')} className="py-3 px-8 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-muted/20">
            {/* Setup OTP Modal Overlay */}
            {showVerificationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-background w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
                        <button onClick={() => setShowVerificationModal(false)} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/20">
                                <ShieldCheck className="h-8 w-8 text-accent" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Verify Your Order</h3>
                            <p className="text-sm text-muted-foreground">
                                For your security, please verify your email address before finalizing the order. We sent a code to <span className="font-bold text-foreground">{shippingData.email || user?.email}</span>.
                            </p>
                        </div>

                        <form onSubmit={handleVerifyOtpAndPlaceOrder} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-center text-xl tracking-widest font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isVerifyingOtp || otpCode.length < 6 || isSendingOtp}
                                className="w-full py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isVerifyingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Complete Final Payment"}
                            </button>
                            <div className="text-center mt-4">
                                <button type="button" onClick={sendVerificationOtp} disabled={isSendingOtp} className="text-sm text-accent hover:underline disabled:opacity-50 font-semibold">
                                    {isSendingOtp ? "Sending..." : "Resend Code"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


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
                                            <input type="text" value={shippingData.firstName} onChange={e => setShippingData(s => ({ ...s, firstName: e.target.value }))} className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <input type="text" value={shippingData.lastName} onChange={e => setShippingData(s => ({ ...s, lastName: e.target.value }))} className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input type="email" value={shippingData.email} onChange={e => setShippingData(s => ({ ...s, email: e.target.value }))} className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Shipping Address</label>
                                        <input type="text" value={shippingData.address} onChange={e => setShippingData(s => ({ ...s, address: e.target.value }))} className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="123 Luxury Ave, Bandra West" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1 space-y-2">
                                            <label className="text-sm font-medium">PIN Code</label>
                                            <input type="text" value={shippingData.pincode} onChange={e => setShippingData(s => ({ ...s, pincode: e.target.value }))} className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="400050" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-medium">City</label>
                                            <input type="text" value={shippingData.city} onChange={e => setShippingData(s => ({ ...s, city: e.target.value }))} className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="Mumbai" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleContinueToPayment}
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
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing || isSendingOtp || isVerifyingOtp}
                                        className="w-full py-4 mt-8 bg-foreground text-background font-bold text-lg rounded-xl flex items-center justify-center hover:bg-primary transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
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
                                    Your order <span className="font-bold text-foreground">#{orderId}</span> has been successfully placed. We&apos;ve sent a verification receipt to your email.
                                </p>

                                <div className="bg-muted p-6 rounded-2xl w-full max-w-sm text-left mb-8 border border-border">
                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 text-accent" /> Authenticity Verification
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        The items in your order will now undergo a final 12-point authentication screening before dispatch. You can track this process live in your dashboard.
                                    </p>
                                </div>

                                <button onClick={() => router.push('/account/orders')} className="py-3 px-8 bg-foreground text-background font-bold rounded-xl flex items-center justify-center hover:bg-primary transition-colors">
                                    View Order Status
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    {step !== 3 && (
                        <div className="w-full lg:w-2/5">
                            <div className="glass-panel p-6 sm:p-8 rounded-3xl border-glass-border shadow-sm sticky top-28">
                                <h3 className="text-xl font-heading font-bold mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-6 custom-scrollbar max-h-[40vh] overflow-y-auto pr-2">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border">
                                                <Image src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                                                    <span className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
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
                    )}

                </div>
            </div>
        </div>
    );
}
