"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
    const pathname = usePathname();

    // Hide consumer footer on seller routes
    if (pathname.startsWith('/seller')) {
        return null;
    }

    return (
        <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-border">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                {/* Brand */}
                <div className="space-y-4">
                    <span className="text-3xl font-heading font-black tracking-tighter text-accent">
                        SARVAHUB
                    </span>
                    <p className="text-primary-foreground/70 text-sm max-w-xs leading-relaxed">
                        The ultra-premium marketplace for curated, authentic, and high-quality products. Excellence delivered.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <button className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"><Instagram className="h-5 w-5" /></button>
                        <button className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"><Twitter className="h-5 w-5" /></button>
                        <button className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"><Facebook className="h-5 w-5" /></button>
                        <button className="p-2 bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"><Youtube className="h-5 w-5" /></button>
                    </div>
                </div>

                {/* Shop */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-lg tracking-wide">Shop</h4>
                    <ul className="space-y-3 text-primary-foreground/70 text-sm">
                        <li><Link href="/category/fashion" className="hover:text-accent transition-colors">Fashion & Apparel</Link></li>
                        <li><Link href="/category/electronics" className="hover:text-accent transition-colors">Premium Electronics</Link></li>
                        <li><Link href="/category/watches" className="hover:text-accent transition-colors">Luxury Watches</Link></li>
                        <li><Link href="/category/beauty" className="hover:text-accent transition-colors">Beauty & Wellness</Link></li>
                    </ul>
                </div>

                {/* Company 1 */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-lg tracking-wide">Company</h4>
                    <ul className="space-y-3 text-primary-foreground/70 text-sm">
                        <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                        <li><Link href="/about" className="hover:text-accent transition-colors">Careers</Link></li>
                        <li><Link href="/seller/onboarding" className="hover:text-accent transition-colors flex items-center gap-1">Become a Seller <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">NEW</span></Link></li>
                        <li><Link href="/about" className="hover:text-accent transition-colors">Press</Link></li>
                    </ul>
                </div>

                {/* Help & Support */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-lg tracking-wide">Help & Info</h4>
                    <ul className="space-y-3 text-primary-foreground/70 text-sm">
                        <li><Link href="/support" className="hover:text-accent transition-colors">Customer Support</Link></li>
                        <li><Link href="/account/orders" className="hover:text-accent transition-colors">Returns & Refunds</Link></li>
                        <li><Link href="/support/faq" className="hover:text-accent transition-colors">FAQs</Link></li>
                        <li><Link href="/feedback" className="hover:text-accent transition-colors">Give Feedback</Link></li>
                    </ul>
                </div>

            </div>

            <div className="container mx-auto px-4 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
                <p>© {new Date().getFullYear()} SarvaHub E-Commerce Pvt Ltd. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer >
    );
}
