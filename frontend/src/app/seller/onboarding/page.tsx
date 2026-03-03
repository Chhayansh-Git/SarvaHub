"use client";

import { useState, useRef } from "react";
import { Check, ChevronRight, UploadCloud, ShieldCheck, Building2, User, FileText, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SellerOnboarding() {
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        businessName: "",
        registrationNumber: "",
        taxId: "",
        founderName: "",
        email: "",
        phone: "",
        address: "",
        category: "Luxury Watches",
        agreeToTerms: false,
        paymentMethod: "card",
        businessDocUrl: "",
        kycDocUrl: ""
    });

    const docInputRef = useRef<HTMLInputElement>(null);
    const kycInputRef = useRef<HTMLInputElement>(null);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [uploadingKyc, setUploadingKyc] = useState(false);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "business" | "kyc") => {
        const file = e.target.files?.[0];
        if (!file) return;
        const isBusiness = type === "business";
        isBusiness ? setUploadingDoc(true) : setUploadingKyc(true);
        try {
            const fileData = new FormData();
            fileData.append("file", file);
            fileData.append("folder", "kyc");
            const res = await api.post("/upload", fileData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
        } catch {
        }
    };

    const uploadDirect = async (file: File, type: "business" | "kyc") => {
        const isBusiness = type === "business";
        isBusiness ? setUploadingDoc(true) : setUploadingKyc(true);
        try {
            const fileData = new FormData();
            fileData.append("file", file);
            fileData.append("folder", "kyc");
            const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1] || "";
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
            const res = await fetch(`${API_URL}/upload`, {
                method: "POST",
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: fileData
            });
            const data = await res.json();
            if (data.url) {
                if (isBusiness) setFormData({...formData, businessDocUrl: data.url});
                else setFormData({...formData, kycDocUrl: data.url});
            }
        } catch (error) {
            console.error(error);
        } finally {
            isBusiness ? setUploadingDoc(false) : setUploadingKyc(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await api.post("/seller/onboarding", {
                businessName: formData.businessName,
                businessType: 'sole_proprietor',
                gstNumber: formData.taxId,
                panNumber: formData.registrationNumber,
                categories: [formData.category],
                contactPerson: {
                    name: formData.founderName,
                    email: formData.email,
                    phone: formData.phone,
                },
                registeredAddress: {
                    line1: formData.address,
                    city: '',
                    state: '',
                    pincode: '',
                },
                documents: {
                    businessRegistration: formData.businessDocUrl,
                    identityProof: formData.kycDocUrl
                }
            });
            setIsSuccess(true);
        } catch {
            // handle error
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-muted/20">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 glass-panel rounded-2xl mb-6 shadow-sm">
                        <ShieldCheck className="h-8 w-8 text-accent" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4">Partner with SarvaHub</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join the world&apos;s most trusted luxury marketplace. Complete our KYC process to earn your Authenticity Badge.
                    </p>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full">
                        <div className="h-full bg-accent rounded-full transition-all duration-500 ease-in-out" style={{ width: `${((step - 1) / 4) * 100}%` }} />
                    </div>
                    {[
                        { id: 1, label: "Business Details", icon: Building2 },
                        { id: 2, label: "Contact Info", icon: User },
                        { id: 3, label: "Document KYC", icon: FileText },
                        { id: 4, label: "Verification", icon: CheckCircle2 },
                        { id: 5, label: "Payment", icon: CreditCard }
                    ].map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 ${step >= s.id ? 'bg-accent text-accent-foreground ring-4 ring-background' : 'bg-muted text-muted-foreground border-2 border-border'}`}>
                                <s.icon className="h-5 w-5" />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="glass-panel p-8 sm:p-12 rounded-3xl border-glass-border shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

                    <div className="min-h-[400px]">
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
                                            <label className="text-sm font-semibold">GSTIN</label>
                                            <input type="text" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="27XXXXX0000X1Z5" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Primary Category</label>
                                        <select className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                            <option>Luxury Watches</option>
                                            <option>Fine Jewelry</option>
                                            <option>Designer Handbags</option>
                                            <option>Premium Audio</option>
                                            <option>Collectibles & Art</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-heading font-bold mb-6">Contact & Support Details</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Authorized Representative Name</label>
                                        <input type="text" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="John Doe" value={formData.founderName} onChange={(e) => setFormData({ ...formData, founderName: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="mt-8 pt-8 border-t border-border/50 flex items-center justify-between">
                            <button onClick={prevStep} disabled={step === 1} className={`px-6 py-3 font-semibold rounded-xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'glass-panel hover:bg-muted text-foreground'}`}>Back</button>

                                            <label className="text-sm font-semibold">Business Email</label>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Phone</label>
                                            <input type="tel" className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Registered Address</label>
                                        <textarea rows={3} className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all resize-none" placeholder="Full address with City, State, PIN Code" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        )}

        }
    }

                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                    <h2 className="text-2xl font-heading font-bold mb-2">Document Verification</h2>
                                    <p className="text-sm text-muted-foreground mb-6">Upload clear scans of your official business documents.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Business Doc */}
                                        <div onClick={() => docInputRef.current?.click()} className={`border-2 border-dashed ${formData.businessDocUrl ? 'border-emerald-500 bg-emerald-500/5' : 'border-border'} rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group relative`}>
                                            <input type="file" ref={docInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { if (e.target.files?.[0]) uploadDirect(e.target.files[0], 'business') }} />

                                            <div className={`w-12 h-12 rounded-full glass-panel flex items-center justify-center transition-colors ${formData.businessDocUrl ? 'text-emerald-500' : 'text-muted-foreground group-hover:text-accent'}`}>
                                                {uploadingDoc ? <Loader2 className="h-6 w-6 animate-spin" /> : formData.businessDocUrl ? <CheckCircle2 className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">Certificate of Incorporation</h4>
                                                <p className="text-xs text-muted-foreground mt-1">{formData.businessDocUrl ? 'Uploaded Successfully' : 'PDF, JPG or PNG (Max 5MB)'}</p>
                                            </div>
                                        </div>

                                        {/* KYC Doc */}
                                        <div onClick={() => kycInputRef.current?.click()} className={`border-2 border-dashed ${formData.kycDocUrl ? 'border-emerald-500 bg-emerald-500/5' : 'border-border'} rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group relative`}>
                                            <input type="file" ref={kycInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { if (e.target.files?.[0]) uploadDirect(e.target.files[0], 'kyc') }} />

                                            <div className={`w-12 h-12 rounded-full glass-panel flex items-center justify-center transition-colors ${formData.kycDocUrl ? 'text-emerald-500' : 'text-muted-foreground group-hover:text-accent'}`}>
                                                {uploadingKyc ? <Loader2 className="h-6 w-6 animate-spin" /> : formData.kycDocUrl ? <CheckCircle2 className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">PAN / Aadhaar Card</h4>
                                                <p className="text-xs text-muted-foreground mt-1">{formData.kycDocUrl ? 'Uploaded Successfully' : 'Founder or Authorized Rep'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                        </div>
                                        <h2 className="text-2xl font-heading font-bold mb-2">Final Review & Agreement</h2>
                                        <p className="text-muted-foreground">Review the SarvaHub Authenticity Pledge before submitting.</p>
                                    </div>
                                    <div className="glass-panel p-6 rounded-2xl border-border bg-background/50 h-56 overflow-y-auto custom-scrollbar mb-6 text-sm text-foreground space-y-4">
                                        <h4 className="font-bold">1. The SarvaHub Authenticity Standard</h4>
                                        <p>Every item listed must be 100% authentic, legally sourced, and match the exact description provided.</p>
                                        <h4 className="font-bold">2. Penalties for Counterfeits</h4>
                                        <p>Selling counterfeit goods results in immediate account termination and legal action.</p>
                                        <h4 className="font-bold">3. Returns and Refunds</h4>
                                        <p>Sellers must adhere to platform return and refund policies.</p>
                                        <h4 className="font-bold">4. Fees</h4>
                                        <p>One-time registration fee of ₹10. Platform commission: 8% per transaction.</p>
                                    </div>
                                    <label className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted transition-colors">
                                        <input type="checkbox" className="mt-1 w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent" checked={formData.agreeToTerms} onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })} />
                                        <div>
                                            <span className="font-bold block">I agree to the Authenticity Pledge and Platform Terms</span>
                                            <span className="text-xs text-muted-foreground mt-1 block">I confirm that all provided information is legally accurate.</span>
                                        </div>
                                    </label>
                                </div>
                            )}

                            {step === 5 && !isSuccess && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CreditCard className="h-8 w-8 text-accent" />
                                        </div>
                                        <h2 className="text-2xl font-heading font-bold mb-2">Registration Fee</h2>
                                        <p className="text-muted-foreground">Complete the one-time onboarding payment of ₹10.</p>
                                    </div>
                                    <div className="glass-panel p-6 rounded-2xl border-border bg-background/50 space-y-6 max-w-md mx-auto">
                                        <div className="text-center p-8 bg-muted/30 rounded-xl">
                                            <p className="text-5xl font-black text-foreground mb-2">₹10</p>
                                            <p className="text-sm text-muted-foreground">One-time registration fee</p>
                                        </div>
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
                                        Your seller application is now under review. Our team will get back to you within 48 hours.
                                    </p>
                                    <button onClick={() => router.push('/seller/dashboard')} className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mx-auto">
                                        Go to Dashboard
                                    </button>
                                </div>
                            )}
                    </div>

                    {!isSuccess && (
                        <div className="mt-8 pt-8 border-t border-border/50 flex items-center justify-between">
                            <button onClick={prevStep} disabled={step === 1} className={`px-6 py-3 font-semibold rounded-xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'glass-panel hover:bg-muted text-foreground'}`}>Back</button>

                            {step < 4 && (
                                <button onClick={nextStep} className="px-8 py-3 bg-foreground text-background font-bold rounded-xl flex items-center gap-2 hover:bg-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                    Continue <ChevronRight className="h-4 w-4" />
                                </button>
                            )}

                            {step === 4 && (
                                <button disabled={!formData.agreeToTerms} onClick={nextStep} className={`px-8 py-3 font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg ${formData.agreeToTerms ? 'bg-accent text-accent-foreground hover:bg-accent/90 hover:-translate-y-0.5' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
                                    Proceed to Payment <ChevronRight className="h-4 w-4" />
                                </button>
                            )}

                            {step === 5 && (
                                <button onClick={handleSubmit} disabled={submitting} className="px-8 py-3 bg-accent text-accent-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50">
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    {submitting ? 'Submitting...' : 'Pay ₹10 & Submit'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
