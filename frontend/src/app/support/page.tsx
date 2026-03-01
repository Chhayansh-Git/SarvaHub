"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Package, RefreshCw, CreditCard, User, HelpCircle, Phone, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";

export default function SupportCenterPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const categories = [
        { id: "all", label: "All Topics", icon: HelpCircle },
        { id: "shipping", label: "Shipping & Delivery", icon: Package },
        { id: "returns", label: "Returns & Exchanges", icon: RefreshCw },
        { id: "payments", label: "Payments & Pricing", icon: CreditCard },
        { id: "account", label: "Account & Profile", icon: User },
    ];

    const faqs = [
        { id: 1, category: "shipping", q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping delivers within 1-2 business days depending on your location." },
        { id: 2, category: "shipping", q: "Do you ship internationally?", a: "Currently, SarvaHub operates exclusively within India to ensure rapid fulfillment and trusted authenticity checks." },
        { id: 3, category: "returns", q: "What is your return policy?", a: "We offer a 14-day conditional return policy for most items. Luxury watches and jewelry have a stricter 7-day policy. Items must be unworn with original tags attached." },
        { id: 4, category: "returns", q: "How do I print a return label?", a: "Return labels are automatically generated when you request a return via your My Orders page. You can download the PDF and securely tape it to your package." },
        { id: 5, category: "payments", q: "What payment methods do you accept?", a: "We accept all major Credit/Debit cards, Netbanking, UPI, and verified EMI options from partner banks." },
        { id: 6, category: "account", q: "How do I change my email address?", a: "You can update your email address in your Account settings under 'Profile Information'. A verification link will be sent to the new address." }
    ];

    const toggleFaq = (id: number) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="relative min-h-screen pt-32 pb-24">
            <BackgroundBeams className="opacity-20 hidden dark:block" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                {/* Header & Search */}
                <div className="text-center space-y-6 mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground">
                        How can we help?
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Search our knowledge base or browse categories below to find answers to your questions.
                    </p>

                    <div className="relative max-w-xl mx-auto mt-8 group">
                        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center bg-background/80 backdrop-blur-xl border border-border/50 rounded-full p-2 shadow-lg hover:border-accent/50 transition-colors">
                            <Search className="h-5 w-5 text-muted-foreground ml-3" />
                            <input
                                type="text"
                                placeholder="Search 'return policy', 'shipping timeframe'..."
                                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-2 text-foreground"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="bg-foreground text-background px-6 py-2 rounded-full font-bold text-sm hover:bg-foreground/90 transition-transform active:scale-95">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                                ? 'bg-foreground text-background shadow-md transform scale-105'
                                : 'glass-panel text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            <cat.icon className="h-4 w-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4 mb-20 min-h-[400px]">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => (
                            <div
                                key={faq.id}
                                className={`glass-panel border overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'border-accent/50 rounded-xl' : 'border-border/50 rounded-lg hover:border-foreground/20'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full flex items-center justify-between p-5 text-left bg-background/40 hover:bg-muted/20 transition-colors"
                                >
                                    <span className="font-semibold text-foreground pr-4 lg:text-lg">{faq.q}</span>
                                    {openFaq === faq.id ? (
                                        <ChevronUp className="h-5 w-5 text-accent flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                    )}
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="p-5 pt-0 text-muted-foreground leading-relaxed">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-muted-foreground glass-panel rounded-2xl border border-border pb-16">
                            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">We couldn't find any articles matching "{searchQuery}"</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-4 text-accent font-medium hover:underline"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                {/* Contact Options */}
                <div>
                    <h2 className="text-2xl font-bold text-center mb-8">Still need assistance?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/support/tickets" className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-accent/50 group transition-all duration-300 hover:-translate-y-1">
                            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent group-hover:scale-110 transition-transform">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Live Chat</h3>
                            <p className="text-sm text-muted-foreground">Chat with our AI assistant or connect directly to a human agent standing by.</p>
                        </Link>

                        <a href="mailto:support@sarvahub.com" className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-accent/50 group transition-all duration-300 hover:-translate-y-1">
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform">
                                <Mail className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Email Us</h3>
                            <p className="text-sm text-muted-foreground">Drop us an email at support@sarvahub.com. We usually reply within 2 hours.</p>
                        </a>

                        <a href="tel:18001234567" className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-accent/50 group transition-all duration-300 hover:-translate-y-1">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
                                <Phone className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Call Dedicated Hotline</h3>
                            <p className="text-sm text-muted-foreground">1-800-SARVAHUB (Available Mon-Sat, 9AM to 7PM IST).</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

