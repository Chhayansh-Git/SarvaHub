"use client";

import { useState } from "react";
import { Check, ChevronRight, UploadCloud, ShieldCheck, Building2, User, FileText, CheckCircle2, CreditCard } from "lucide-react";

export default function SellerOnboarding() {
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        businessName: "",
        registrationNumber: "",
        taxId: "",
        founderName: "",
        email: "",
        phone: "",
        address: "",
        category: "Watches",
        agreeToTerms: false,
        paymentMethod: "card"
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen pt-24 pb-20 bg-muted/20">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 glass-panel rounded-2xl mb-6 shadow-sm">
                        <ShieldCheck className="h-8 w-8 text-accent" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4">Partner with SarvaHub</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join the world&apos;s most trusted luxury marketplace. Complete our rigorous KYC process to earn your Authenticity Badge and start selling to our premium client base.
                    </p>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full">
                        <div
                            className="h-full bg-accent rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${((step - 1) / 4) * 100}%` }}
                        />
                    </div>

                    {[
                        { id: 1, label: "Business Details", icon: Building2 },
                        { id: 2, label: "Contact Info", icon: User },
                        { id: 3, label: "Document KYC", icon: FileText },
                        { id: 4, label: "Verification", icon: CheckCircle2 },
                        { id: 5, label: "Payment", icon: CreditCard }
                    ].map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 ${step >= s.id ? 'bg-accent text-accent-foreground ring-4 ring-background' : 'bg-muted text-muted-foreground border-2 border-border'
                                }`}>
                                <s.icon className="h-5 w-5" />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="glass-panel p-8 sm:p-12 rounded-3xl border-glass-border shadow-2xl relative overflow-hidden">
                    {/* Subtle decorative glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

                    <div className="min-h-[400px]">
                        {/* STEP 1: Business Details */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-heading font-bold mb-6">Business Information</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Legal Business Name</label>
                                        <input type="text" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/50" placeholder="e.g. Mumbai Horology Pvt Ltd." value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">CIN / Registration Number</label>
                                            <input type="text" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="U74999MH20..." value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">GSTIN (Goods and Services Tax ID)</label>
                                            <input type="text" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="27XXXXX0000X1Z5" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Primary Category</label>
                                        <div className="relative">
                                            <select
                                                className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all appearance-none cursor-pointer"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option>Luxury Watches</option>
                                                <option>Fine Jewelry</option>
                                                <option>Designer Handbags</option>
                                                <option>Rare Antiques</option>
                                                <option>Collectibles & Art</option>
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rotate-90 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Contact Info */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-heading font-bold mb-6">Contact & Support Details</h2>
                                <p className="text-sm text-muted-foreground mb-6">This information will be used for internal verification and partial display on your public Seller Profile for customer trust.</p>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Authorized Representative / Founder Name</label>
                                        <input type="text" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="John Doe" value={formData.founderName} onChange={(e) => setFormData({ ...formData, founderName: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Official Business Email</label>
                                            <input type="email" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="contact@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Support Phone Number</label>
                                            <input type="tel" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Registered Business Address</label>
                                        <textarea
                                            rows={3}
                                            className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all resize-none custom-scrollbar"
                                            placeholder="Enter full address including City, State, and PIN Code"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Document KYC */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-heading font-bold mb-2">Document Verification</h2>
                                <p className="text-sm text-muted-foreground mb-6">To maintain platform integrity, please upload clear scans of your official business documents.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Cert of Incorporation */}
                                    <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                                            <UploadCloud className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">Certificate of Incorporation / Partnership Deed</h4>
                                            <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG (Max 5MB)</p>
                                        </div>
                                    </div>

                                    {/* Govt ID */}
                                    <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                                            <UploadCloud className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">PAN / Aadhaar Card</h4>
                                            <p className="text-xs text-muted-foreground mt-1">Founder or Authorized Rep</p>
                                        </div>
                                    </div>

                                    {/* Proof of Address */}
                                    <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group sm:col-span-2">
                                        <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                                            <UploadCloud className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">Proof of Business Address</h4>
                                            <p className="text-xs text-muted-foreground mt-1">Recent utility bill or bank statement (within 90 days)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Review & Agreement */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold mb-2">Final Review & Agreement</h2>
                                    <p className="text-muted-foreground">Please review the SarvaHub Authenticity Pledge before submitting your application.</p>
                                </div>

                                <div className="glass-panel p-6 rounded-2xl border-border bg-background/50 h-56 overflow-y-auto custom-scrollbar mb-6 text-sm text-foreground space-y-4">
                                    <h4 className="font-bold">1. The SarvaHub Authenticity Standard</h4>
                                    <p>As a verified partner, you agree that every single item listed on the platform is 100% authentic, legally sourced, and matches the exact description provided.</p>
                                    <h4 className="font-bold">2. Penalties for Counterfeits</h4>
                                    <p>Any attempt to sell counterfeit, misrepresented, or stolen goods will result in immediate permanent account termination, confiscation of funds, and referral to authorities.</p>
                                    <h4 className="font-bold">3. Returns and Refunds</h4>
                                    <p>Sellers must adhere to platform return and refund policies, which are subjective and vary depending on the category and specific type of product sold (e.g., Electronics vs. Apparel).</p>
                                    <h4 className="font-bold">4. Fees & Verification Tier</h4>
                                    <p>A one-time non-refundable application fee of ₹20,000 is required upon application review. Platform commission sits at 8% per transaction for verified partners.</p>
                                </div>

                                <label className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted transition-colors">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"
                                        checked={formData.agreeToTerms}
                                        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                    />
                                    <div>
                                        <span className="font-bold block">I agree to the Authenticity Pledge and Platform Terms</span>
                                        <span className="text-xs text-muted-foreground mt-1 block">I confirm that all provided information is legally accurate.</span>
                                    </div>
                                </label>
                            </div>
                        )}
                        {/* STEP 5: Payment */}
                        {step === 5 && !isSuccess && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CreditCard className="h-8 w-8 text-accent" />
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold mb-2">Registration Fee</h2>
                                    <p className="text-muted-foreground">Complete your one-time onboarding payment of ₹20,000 to submit your seller application.</p>
                                </div>
                                <div className="glass-panel p-6 rounded-2xl border-border bg-background/50 space-y-6 max-w-md mx-auto">

                                    {/* Payment Method Selector */}
                                    <div className="flex bg-muted/50 p-1 rounded-xl">
                                        {['card', 'upi', 'netbanking'].map((method) => (
                                            <button
                                                key={method}
                                                onClick={() => setFormData({ ...formData, paymentMethod: method })}
                                                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg capitalize transition-all ${formData.paymentMethod === method ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                {method === 'card' ? 'Card' : method === 'upi' ? 'UPI / QR' : 'Netbanking'}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Card Form */}
                                    {formData.paymentMethod === 'card' && (
                                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold">Card Number</label>
                                                <input type="text" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono tracking-widest" placeholder="0000 0000 0000 0000" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold">Expiry</label>
                                                    <input type="text" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono" placeholder="MM/YY" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold">CVV</label>
                                                    <input type="password" maxLength={4} className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono tracking-widest" placeholder="***" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold">Name on Card</label>
                                                <input type="text" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none" placeholder="JOHN DOE" />
                                            </div>
                                        </div>
                                    )}

                                    {/* UPI Form */}
                                    {formData.paymentMethod === 'upi' && (
                                        <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                                            <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-border select-none relative group">
                                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white font-bold cursor-pointer">
                                                    Mock Scan
                                                </div>
                                                <div className="w-full h-full border-4 border-dashed border-muted-foreground/30 flex items-center justify-center">
                                                    <span className="text-4xl font-black text-muted-foreground/30">QR</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-sm font-semibold">Or enter UPI ID</label>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <input type="text" className="flex-1 p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none font-mono" placeholder="username@upi" />
                                                    <button className="px-6 py-4 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors whitespace-nowrap">Verify</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Netbanking Form */}
                                    {formData.paymentMethod === 'netbanking' && (
                                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300 relative">
                                            <div className="space-y-2 relative">
                                                <label className="text-sm font-semibold">Select Bank</label>
                                                <select className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer">
                                                    <option value="" disabled selected>Choose your bank</option>
                                                    <option>State Bank of India</option>
                                                    <option>HDFC Bank</option>
                                                    <option>ICICI Bank</option>
                                                    <option>Axis Bank</option>
                                                    <option>Kotak Mahindra Bank</option>
                                                    <option>Punjab National Bank</option>
                                                    <option>Bank of Baroda</option>
                                                </select>
                                                <div className="pointer-events-none absolute right-4 top-[44px] text-muted-foreground">
                                                    <ChevronRight className="h-5 w-5 rotate-90" />
                                                </div>
                                            </div>
                                            <p className="text-sm text-center text-muted-foreground pt-4 leading-relaxed">
                                                You will be securely redirected to your bank&apos;s authorization portal to complete the transaction.
                                            </p>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}

                        {isSuccess && (
                            <div className="text-center py-12 animate-in fade-in duration-500">
                                <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                    <Check className="h-16 w-16 text-emerald-500" />
                                </div>
                                <h2 className="text-3xl font-heading font-black mb-4">Application Submitted!</h2>
                                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                    Your payment of ₹20,000 was successful. Your KYC documents and application are now under review. Our team will get back to you within 48 hours.
                                </p>
                                <button className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mx-auto">
                                    Go to Dashboard
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    {!isSuccess && (
                        <div className="mt-8 pt-8 border-t border-border/50 flex items-center justify-between">
                            <button
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`px-6 py-3 font-semibold rounded-xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'glass-panel hover:bg-muted text-foreground'}`}
                            >
                                Back
                            </button>

                            {step < 4 && (
                                <button
                                    onClick={nextStep}
                                    className="px-8 py-3 bg-foreground text-background font-bold rounded-xl flex items-center gap-2 hover:bg-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Continue <ChevronRight className="h-4 w-4" />
                                </button>
                            )}

                            {step === 4 && (
                                <button
                                    disabled={!formData.agreeToTerms}
                                    onClick={nextStep}
                                    className={`px-8 py-3 font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg ${formData.agreeToTerms
                                        ? 'bg-accent text-accent-foreground hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-xl'
                                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                                        }`}
                                >
                                    Proceed to Payment <ChevronRight className="h-4 w-4" />
                                </button>
                            )}

                            {step === 5 && (
                                <button
                                    onClick={() => setIsSuccess(true)}
                                    className="px-8 py-3 bg-accent text-accent-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Pay ₹20,000 & Submit <Check className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
}
