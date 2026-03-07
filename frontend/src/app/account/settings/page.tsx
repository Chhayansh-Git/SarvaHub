"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Settings, ArrowLeft, Camera, Shield, User, Loader2, Check, Lock } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";

export default function ProfileSettingsPage() {
    const { user, setUser } = useUserStore();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    if (!user) return null;

    const handleSave = async () => {
        setIsLoading(true);
        setIsSuccess(false);
        try {
            await api.patch<any>('/users/me', {
                name: formData.name,
                email: formData.email,
            });
            setUser({ ...user, name: formData.name, email: formData.email });
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to save your changes. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setUploadingAvatar(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const data = await api.post<{ url: string }>("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            await api.patch('/users/me', { avatar: data.url });
            setUser({ ...user, avatar: data.url });
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!confirm("Are you sure you want to remove your profile picture?")) return;
        setUploadingAvatar(true);
        try {
            await api.patch('/users/me', { avatar: '' });
            setUser({ ...user, avatar: '' });
            alert("Profile picture removed.");
        } catch (error) {
            console.error("Remove failed", error);
            alert("Failed to remove profile picture.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return alert("New passwords do not match.");
        }
        if (passwordData.newPassword.length < 8) {
            return alert("Password must be at least 8 characters long.");
        }

        setIsLoading(true);
        try {
            await api.post('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            alert("Password updated successfully!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            console.error("Password change failed", error);
            alert(error.message || "Failed to change password. Please check your current password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.push('/account')} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                            <Settings className="h-8 w-8 text-accent" />
                            Profile Settings
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage your personal information and security</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Sidebar quick jumps */}
                    <div className="md:col-span-1 space-y-2">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-colors ${activeTab === 'personal' ? 'bg-muted text-foreground' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}`}
                        >
                            <User className="h-5 w-5" /> Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-colors ${activeTab === 'security' ? 'bg-muted text-foreground' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}`}
                        >
                            <Shield className="h-5 w-5" /> Security & Password
                        </button>
                    </div>

                    {/* Form Area */}
                    <div className="md:col-span-2 space-y-8">
                        {activeTab === 'personal' && (
                            <>
                                {/* Avatar Section */}
                                <div className="glass-panel p-8 rounded-3xl border border-border/50 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative group cursor-pointer">
                                        <label className="cursor-pointer block">
                                            <input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleAvatarChange} disabled={uploadingAvatar} />
                                            <div className={`w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/20 overflow-hidden ${uploadingAvatar ? 'opacity-50' : ''}`}>
                                                {user.avatar ? (
                                                    <Image src={user.avatar} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-accent font-bold text-2xl">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                {uploadingAvatar ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
                                            </div>
                                        </label>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-lg font-bold mb-1">Profile Picture</h3>
                                        <p className="text-sm text-muted-foreground mb-4">PNG, JPG under 5MB</p>
                                        <div className="flex gap-3 justify-center sm:justify-start">
                                            <label className="cursor-pointer px-4 py-2 bg-foreground text-background font-semibold rounded-lg text-sm hover:bg-primary transition-colors">
                                                Upload New
                                                <input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleAvatarChange} disabled={uploadingAvatar} />
                                            </label>
                                            <button onClick={handleRemoveAvatar} disabled={uploadingAvatar || !user.avatar} className="px-4 py-2 bg-muted hover:bg-red-500/10 hover:text-red-500 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Remove</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Form */}
                                <div className="glass-panel p-8 rounded-3xl border border-border/50">
                                    <h3 className="text-xl font-bold mb-6">Personal Details</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
                                            <div className="flex gap-2">
                                                <select className="bg-background border border-border/50 rounded-xl px-3 py-3 focus:outline-none focus:border-accent text-sm w-24">
                                                    <option>+91</option>
                                                    <option>+1</option>
                                                    <option>+44</option>
                                                </select>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="9876543210"
                                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading || isSuccess}
                                        className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isSuccess && <Check className="h-4 w-4" />}
                                        {isSuccess ? "Saved!" : "Save Changes"}
                                    </button>
                                </div>
                            </>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordChange} className="glass-panel p-8 rounded-3xl border border-border/50">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Lock className="h-6 w-6 text-accent" /> Password Settings
                                </h3>

                                <div className="space-y-6 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        />
                                    </div>

                                    <div className="border-t border-border/50 my-6"></div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 mt-6 bg-foreground text-background font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Updating Password...
                                            </>
                                        ) : (
                                            'Update Password'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
