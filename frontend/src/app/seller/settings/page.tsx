"use client";

import { useState, useEffect } from "react";
import { Building2, Save, Store, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

export default function SellerSettingsPage() {
    const { user, fetchUser } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
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
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);

        try {
            await api.patch('/seller/settings', formData);
            // Refresh user store to get updated profile
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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight">Store Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your business profile and preferences.</p>
                </div>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-2xl border-border/50">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                    <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Business Information</h2>
                        <p className="text-sm text-muted-foreground">Update your officially registered business details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                            <label className="text-sm font-bold opacity-80">GST Number</label>
                            <input
                                type="text"
                                value={formData.gstNumber}
                                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold opacity-80">PAN Number</label>
                            <input
                                type="text"
                                value={formData.panNumber}
                                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                                className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border/50">
                        <h2 className="text-lg font-bold mb-4">Contact & Operation Details</h2>
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
                                    <option value="Fine Jewelry">Fine Jewelry</option>
                                    <option value="Collectibles">Collectibles</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Beauty">Beauty</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">Contact Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">Contact Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold opacity-80">Registered Business Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={2}
                                    className="w-full bg-muted/50 border-transparent rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none custom-scrollbar"
                                />
                            </div>
                        </div>
                    </div>

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
