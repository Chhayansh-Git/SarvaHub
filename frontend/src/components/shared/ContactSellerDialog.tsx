"use client";

import { useState } from "react";
import { MessageSquare, Send, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

interface ContactSellerDialogProps {
    sellerId: string;
    sellerName: string;
    productId: string;
    productName: string;
}

export function ContactSellerDialog({ sellerId, sellerName, productId, productName }: ContactSellerDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus("idle");
        setErrorMsg("");

        try {
            await api.post('/support/tickets', {
                subject: `[Product Inquiry: ${productName}] ${subject}`,
                message,
                sellerId,
                productId,
                type: 'seller_inquiry',
                priority: 'normal'
            });
            setStatus("success");
            setTimeout(() => {
                setIsOpen(false);
                setStatus("idle");
                setMessage("");
                setSubject("");
            }, 3000);
        } catch (error: any) {
            setStatus("error");
            setErrorMsg(error.message || "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm font-medium glass-panel px-4 py-2 rounded-lg hover:text-accent border border-border/50 hover:border-accent/50 transition-colors flex items-center gap-2 group"
            >
                <MessageSquare className="h-4 w-4 group-hover:text-accent transition-colors" />
                Contact Seller
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

                    <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/30">
                            <div>
                                <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-accent" />
                                    Message Seller
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Inquiring about <strong>{productName}</strong> to <strong>{sellerName}</strong>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {status === "success" ? (
                                <div className="py-8 flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom-4">
                                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                                    <p className="text-muted-foreground">
                                        Your inquiry has been sent to {sellerName}. A support ticket has been created and you will be notified when they reply.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {status === "error" && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                            <span>{errorMsg}</span>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label htmlFor="subject" className="text-sm font-medium">Subject / Topic</label>
                                        <input
                                            id="subject"
                                            required
                                            disabled={isSubmitting}
                                            placeholder="e.g. Dimensions, Sourcing, Material..."
                                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="message" className="text-sm font-medium">Message Details</label>
                                        <textarea
                                            id="message"
                                            required
                                            disabled={isSubmitting}
                                            rows={5}
                                            placeholder="Write your detailed inquiry here..."
                                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent resize-none custom-scrollbar"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </div>

                                    <div className="pt-2 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() => setIsOpen(false)}
                                            className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !subject.trim() || !message.trim()}
                                            className="px-6 py-2.5 rounded-xl font-bold bg-foreground text-background hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4" />
                                                    Send Inquiry
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
