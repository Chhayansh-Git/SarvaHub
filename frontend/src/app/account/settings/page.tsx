"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Settings, ArrowLeft, Camera, Shield, User } from "lucide-react";
import Image from "next/image";

export default function ProfileSettingsPage() {
    const { user, isAuthenticated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.push('/');
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) return null;

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
                        <button className="w-full text-left px-4 py-3 bg-muted rounded-xl font-semibold flex items-center gap-3">
                            <User className="h-5 w-5" /> Personal Info
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-xl font-semibold flex items-center gap-3 transition-colors">
                            <Shield className="h-5 w-5" /> Security & Password
                        </button>
                    </div>

                    {/* Form Area */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Avatar Section */}
                        <div className="glass-panel p-8 rounded-3xl border border-border/50 flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/20 overflow-hidden">
                                    {user.avatar ? (
                                        <Image src={user.avatar} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-accent font-bold text-2xl">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-bold mb-1">Profile Picture</h3>
                                <p className="text-sm text-muted-foreground mb-4">PNG, JPG under 5MB</p>
                                <div className="flex gap-3 justify-center sm:justify-start">
                                    <button className="px-4 py-2 bg-foreground text-background font-semibold rounded-lg text-sm hover:bg-primary transition-colors">Upload New</button>
                                    <button className="px-4 py-2 bg-muted hover:bg-red-500/10 hover:text-red-500 font-semibold rounded-lg text-sm transition-colors">Remove</button>
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
                                        defaultValue={user.name}
                                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue={user.email}
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
                                            placeholder="98765 43210"
                                            className="flex-1 bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
                                <button className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
