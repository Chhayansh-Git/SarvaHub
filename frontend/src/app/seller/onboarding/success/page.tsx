"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

export default function OnboardingSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");
    const { user, setUser } = useUserStore();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            setErrorMessage("No session ID found.");
            return;
        }

        const confirmPayment = async () => {
            try {
                const data = await api.post<any>("/seller/onboarding/confirm", {
                    session_id: sessionId,
                });

                // Update local user state
                if (user) {
                    setUser({ ...user, role: data.role || 'seller' });
                }

                setStatus("success");

                // Auto-redirect to dashboard after 3 seconds
                setTimeout(() => {
                    router.push("/seller/dashboard");
                }, 3000);
            } catch (err: any) {
                console.error("Payment confirmation failed:", err);
                setStatus("error");
                setErrorMessage(err.response?.data?.message || "Failed to confirm payment.");
            }
        };

        confirmPayment();
    }, [sessionId, router, user, setUser]);

    return (
        <div className="min-h-screen pt-32 pb-20 bg-muted/20 flex flex-col items-center justify-center">
            <div className="glass-panel p-12 rounded-3xl text-center max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-500">
                {status === "loading" && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
                            <Loader2 className="h-12 w-12 text-accent animate-spin" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black mb-2">Verifying Payment...</h2>
                            <p className="text-muted-foreground">Please don't close this page.</p>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                            <CheckCircle2 className="h-12 w-12 text-emerald-500 drop-shadow" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">Welcome to SarvaHub!</h2>
                            <p className="text-muted-foreground">Your payment of ₹10 was successful. You are now an official seller.</p>
                        </div>
                        <p className="text-sm text-muted-foreground animate-pulse mt-4">Redirecting to your dashboard...</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
                            <XCircle className="h-12 w-12 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black mb-2 text-red-500">Payment Failed</h2>
                            <p className="text-muted-foreground mb-6">{errorMessage}</p>
                            <button
                                onClick={() => router.push("/seller/onboarding")}
                                className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-all shadow-lg w-full"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
