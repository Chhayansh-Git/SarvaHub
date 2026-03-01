"use client";

import { useState } from "react";
import { Link2, QrCode, Facebook, Twitter, Mail, Check, X, Share2, Send, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareProductProps {
    productUrl: string;
    productName: string;
}

export function ShareProduct({ productUrl, productName }: ShareProductProps) {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // We are using a public dummy QR image for now.
    const qrImage = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(productUrl);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(productUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        { name: "WhatsApp", icon: MessageSquare, href: `https://wa.me/?text=Check out ${productName} on SarvaHub: ${productUrl}`, brandColor: "bg-green-500 hover:bg-green-600 focus:bg-green-700" },
        { name: "Telegram", icon: Send, href: `https://t.me/share/url?url=${productUrl}&text=Check out ${productName}`, brandColor: "bg-blue-500 hover:bg-blue-600 focus:bg-blue-700" },
        { name: "Twitter / X", icon: Twitter, href: `https://twitter.com/intent/tweet?text=Check out ${productName}&url=${productUrl}`, brandColor: "bg-neutral-800 hover:bg-neutral-900 focus:bg-black" },
        { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`, brandColor: "bg-blue-600 hover:bg-blue-700 focus:bg-blue-800" },
        { name: "Email", icon: Mail, href: `mailto:?subject=${productName}&body=Check out this premium item on SarvaHub: ${productUrl}`, brandColor: "bg-red-500 hover:bg-red-600 focus:bg-red-700" },
    ];

    return (
        <>
            <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel hover:bg-accent hover:text-accent-foreground transition-all border border-border group font-semibold"
            >
                <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Share Product
            </button>

            {/* Unified Share Modal */}
            <AnimatePresence>
                {isShareOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg glass-panel-light p-8 rounded-3xl border border-glass-border shadow-2xl flex flex-col"
                        >
                            <button
                                onClick={() => setIsShareOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h3 className="text-2xl font-heading font-black mb-6">Share with friends</h3>

                            {/* Quick Share Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                                {shareLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${link.brandColor} text-white p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md`}
                                    >
                                        <link.icon className="h-6 w-6" />
                                        <span className="text-xs font-semibold">{link.name}</span>
                                    </a>
                                ))}

                                <button
                                    onClick={copyToClipboard}
                                    className="bg-muted text-foreground p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors hover:bg-foreground hover:text-background shadow-sm hover:shadow-md border border-border"
                                >
                                    {copied ? <Check className="h-6 w-6 text-emerald-500" /> : <Link2 className="h-6 w-6" />}
                                    <span className="text-xs font-semibold">{copied ? "Copied!" : "Copy Link"}</span>
                                </button>
                            </div>

                            {/* QR Code Section */}
                            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-32 h-32 shrink-0 bg-white p-2 rounded-xl border border-border shadow-sm">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={qrImage} alt="QR Code" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1 flex items-center gap-2">
                                        <QrCode className="h-4 w-4 text-accent" /> Scan to view on mobile
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Share this product instantly with anyone nearby. They just need to scan this code with their camera.
                                    </p>
                                    <a
                                        href={qrImage}
                                        download={`sarvahub-qr-${productName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                        className="text-sm font-semibold text-accent hover:underline flex items-center gap-1"
                                    >
                                        Download QR Code Image
                                    </a>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
