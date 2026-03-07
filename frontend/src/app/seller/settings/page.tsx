"use client";

import { useState, useEffect } from "react";
import { Building2, Save, Store, Loader2, CheckCircle2, ShieldAlert, CreditCard, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

export default function SellerSettingsPage() {
    const { user, fetchUser } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<'business' | 'kyc_payments'>('business');

    // Business Data
    const [formData, setFormData] = useState({
        businessName: "",
        businessType: "sole_proprietor",
        gstNumber: "",
        panNumber: "",
        founderName: "",
        email: "",
        phone: "",
        address: "",
        category: "",
    });

    // KYC Data
    const [kycData, setKycData] = useState({
        documentType: "pan_card",
        documentNumber: "",
        documentUrl: "",
    });

    // Bank Data
    const [bankData, setBankData] = useState({
        accountName: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
    });

    useEffect(() => {
        if (user?.sellerProfile) {
            const profile = user.sellerProfile;
            setFormData({
                businessName: profile.businessName || "",
                businessType: profile.businessType || "sole_proprietor",
                gstNumber: profile.gstNumber || "",
                panNumber: profile.panNumber || "",
                founderName: profile.contactPerson?.name || "",
                email: profile.contactEmail || profile.contactPerson?.email || "",
                phone: profile.contactPhone || profile.contactPerson?.phone || "",
                address: profile.location || profile.registeredAddress?.line1 || "",
                category: (profile.categories && profile.categories[0]) || "",
            });

            if (profile.kycDetails) {
                setKycData({
                    documentType: profile.kycDetails.documentType || "pan_card",
                    documentNumber: profile.kycDetails.documentNumber || "",
                    documentUrl: profile.kycDetails.documentUrl || "",
                });
            }

            if (profile.bankDetails) {
                setBankData({
                    accountName: profile.bankDetails.accountName || "",
                    accountNumber: profile.bankDetails.accountNumber || "",
                    ifsc: profile.bankDetails.ifsc || "",
                    bankName: profile.bankDetails.bankName || "",
                });
            }
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);

        try {
            const payload = {
                ...formData,
                kycDetails: kycData.documentNumber ? kycData : undefined,
                bankDetails: bankData.accountNumber ? bankData : undefined,
            };

            await api.patch('/seller/settings', payload);
            await fetchUser();
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (error: any) {
            alert(error.response?.data?.message || error.message || "Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    const kycStatus = user.sellerProfile?.kycDetails?.verificationStatus || 'pending';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight">Store Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your business profile, KYC, and payment preferences.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border/50 pb-px">
                <button
                    onClick={() => setActiveTab('business')}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'business' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Business Profile
                </button>
                <button
                    onClick={() => setActiveTab('kyc_payments')}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'kyc_payments' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    KYC & Payments {kycStatus === 'pending' && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                </button>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-2xl border-border/50">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* --- BUSINESS TAB --- */}
                    {activeTab === 'business' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                                <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Business Information</h2>
                                    <p className="text-sm text-muted-foreground">Publicly visible details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80 flex items-center gap-2">
                                        <Store className="h-4 w-4 text-accent" /> Business Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">Business Type</label>
                                    <select
                                        value={formData.businessType}
                                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                        className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    >
                                        <option value="sole_proprietor">Sole Proprietorship</option>
                                        <option value="llp">LLP</option>
                                        <option value="private_limited">Private Limited</option>
                                        <option value="public_limited">Public Limited</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">Founder / Contact Name</label>
                                    <input
                                        type="text"
                                        value={formData.founderName}
                                        onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                                        className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">Primary Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Luxury Watches">Luxury Watches</option>
                                        <option value="Designer Handbags">Designer Handbags</option>
                                        <option value="Fashion">Fashion</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">Registered Business Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={2}
                                    className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none custom-scrollbar"
                                />
                            </div>
                        </div>
                    )}

                    {/* --- KYC & PAYMENTS TAB --- */}
                    {activeTab === 'kyc_payments' && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">

                            {/* Verification Status Banner */}
                            <div className={`p-4 rounded-xl border flex gap-4 items-start ${kycStatus === 'verified' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : kycStatus === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400'}`}>
                                <ShieldAlert className="h-6 w-6 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-base capitalize">Account Status: {kycStatus}</h3>
                                    <p className="text-sm opacity-80 mt-1">
                                        {kycStatus === 'verified'
                                            ? 'Your business and background checks are fully verified. You are eligible for B2B procurement and payouts.'
                                            : kycStatus === 'rejected'
                                                ? 'Your verification was rejected. Please update your documents.'
                                                : 'Your KYC documents are currently under review. Payouts for orders are held until verification is complete (typically 24-48 hours).'}
                                    </p>
                                </div>
                            </div>

                            {/* KYC Documents */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="h-5 w-5 text-accent" />
                                    <h2 className="text-xl font-bold">KYC Documents</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-80">Document Type</label>
                                        <select
                                            value={kycData.documentType}
                                            onChange={(e) => setKycData({ ...kycData, documentType: e.target.value })}
                                            className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        >
                                            <option value="pan_card">Business PAN</option>
                                            <option value="gst_certificate">GST Certificate</option>
                                            <option value="incorporation_certificate">Certificate of Incorporation</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-80">Document Number</label>
                                        <input
                                            type="text"
                                            value={kycData.documentNumber}
                                            onChange={(e) => setKycData({ ...kycData, documentNumber: e.target.value })}
                                            className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono uppercase"
                                            placeholder={kycData.documentType === 'pan_card' ? 'ABCDE1234F' : ''}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-80">GST Number (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.gstNumber}
                                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                            className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-border/50" />

                            {/* Bank Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="h-5 w-5 text-accent" />
                                    <h2 className="text-xl font-bold">Payout Options (Bank Account)</h2>
                                </div>
                                <p className="text-sm text-muted-foreground -mt-4 mb-4 text-balance">
                                    This bank account will be used to automatically process payouts for your sales, post commission splits.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-80">Account Holder Name</label>
                                        <input
                                            type="text"
                                            value={bankData.accountName}
                                            onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })}
                                            className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                            placeholder="Matching KYC Document"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-80">Bank Name</label>
                                        <input
                                            type="text"
                                            value={bankData.bankName}
                                            onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                                            className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-80">Account Number</label>
                                        <input
                                            type="password"
                                            value={bankData.accountNumber}
                                            onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                                            className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-80">IFSC Code</label>
                                        <input
                                            type="text"
                                            value={bankData.ifsc}
                                            onChange={(e) => setBankData({ ...bankData, ifsc: e.target.value })}
                                            className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-6 border-t border-border/50 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 min-w-[140px] hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isSuccess ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5" /> Saved
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
