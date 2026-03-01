"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion, PackageOpen, RefreshCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        category: "Orders & Shipping",
        icon: PackageOpen,
        color: "text-blue-500",
        items: [
            { q: "How long does standard delivery take?", a: "Standard delivery typically takes 3-5 business days for domestic orders, and 7-14 business days for international shipments depending on customs clearance." },
            { q: "Can I track my order in real-time?", a: "Yes. Once your order has shipped, you will receive a tracking link via email and SMS. You can also monitor the status directly from your My Orders dashboard." },
            { q: "Do you ship to P.O. boxes?", a: "Because our items are high-value and require a signature upon delivery, we currently cannot ship to P.O. boxes or military APO/FPO addresses." }
        ]
    },
    {
        category: "Returns & Exchanges",
        icon: RefreshCcw,
        color: "text-orange-500",
        items: [
            { q: "What is your return policy?", a: "We offer a 14-day return window from the date of delivery. Items must be unworn, unused, and include all original tags, packaging, and authenticity cards." },
            { q: "How do I initiate a return?", a: "Navigate to your Account Dashboard, select 'My Orders', find the relevant order, and click 'Return'. Print the provided shipping label and schedule a pickup." },
            { q: "Are there return shipping fees?", a: "Returns are free for SarvaHub Elite members. For standard users, a flat ₹500 return shipping fee is deducted from the refund amount." }
        ]
    },
    {
        category: "Authenticity & Trust",
        icon: ShieldCheck,
        color: "text-green-500",
        items: [
            { q: "How do you guarantee authenticity?", a: "Every item sold on SarvaHub passes through our rigorous multi-point in-house inspection process by certified brand experts before it reaches you. We back this with a 100% money-back guarantee." },
            { q: "What if my item is proven fake?", a: "If an item you purchased is proven to be counterfeit by a verifiable third-party, we will refund you 100% of the purchase price plus any shipping and authentication fees." }
        ]
    }
];

export default function FAQPage() {
    const [openIdx, setOpenIdx] = useState<string>("0-0");

    const toggleAccordion = (id: string) => {
        setOpenIdx(openIdx === id ? "" : id);
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageCircleQuestion className="h-8 w-8 text-accent" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-muted-foreground w-full md:w-2/3 mx-auto">
                        Find answers to common questions about shipping, returns, and authenticity. Need more help? Contact our support team directly.
                    </p>
                </div>

                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 delay-100">
                    {faqs.map((section, sIdx) => (
                        <div key={sIdx}>
                            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border/50">
                                <section.icon className={`h-6 w-6 ${section.color}`} />
                                <h2 className="text-2xl font-bold font-heading">{section.category}</h2>
                            </div>

                            <div className="space-y-4">
                                {section.items.map((item, iIdx) => {
                                    const id = `${sIdx}-${iIdx}`;
                                    const isOpen = openIdx === id;

                                    return (
                                        <div key={iIdx} className="glass-panel border border-border/50 rounded-2xl overflow-hidden transition-all duration-300">
                                            <button
                                                onClick={() => toggleAccordion(id)}
                                                className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-lg hover:bg-muted/30 transition-colors"
                                            >
                                                {item.q}
                                                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            <div
                                                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                                            >
                                                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                                    {item.a}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Support Card */}
                <div className="mt-16 glass-panel border border-accent/20 bg-accent/5 p-8 md:p-12 rounded-[2.5rem] text-center">
                    <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Our dedicated support staff is available 24/7 to assist you with any inquiries regarding your account or orders.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/support/tickets" className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors">
                            Open a Ticket
                        </Link>
                        <button className="px-8 py-3 bg-background border border-border/50 text-foreground font-bold rounded-xl hover:border-accent transition-colors">
                            Live Chat
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
