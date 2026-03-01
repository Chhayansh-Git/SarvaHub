import Link from "next/link";
import { HelpCircle, FileText, Shield, ExternalLink } from "lucide-react";

export function SellerFooter() {
    return (
        <footer className="bg-background border-t border-border/50 pt-12 pb-8 mt-auto z-10 relative">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                    {/* Brand & Ethos */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-xl font-heading font-black tracking-tighter text-foreground mb-4 hidden md:block">
                            SARVAHUB <span className="text-accent text-sm tracking-widest font-bold uppercase ml-1">Seller</span>
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Empowering premium brands and verified resellers with advanced tools, market insights, and absolute authenticity.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-accent" /> Management
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/seller/dashboard" className="hover:text-accent transition-colors">Dashboard Overview</Link></li>
                            <li><Link href="/seller/products" className="hover:text-accent transition-colors">Inventory & Listings</Link></li>
                            <li><Link href="/seller/orders" className="hover:text-accent transition-colors">Order Fulfillment</Link></li>
                            <li><Link href="/seller/analytics" className="hover:text-accent transition-colors">Performance Analytics</Link></li>
                        </ul>
                    </div>

                    {/* Support & Help */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-accent" /> Support & Docs
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/seller/support/center" className="hover:text-accent transition-colors">Seller Help Center</Link></li>
                            <li><Link href="/seller/support/contact" className="hover:text-accent transition-colors">Contact Support Team</Link></li>
                            <li><Link href="/seller/support/api" className="hover:text-accent transition-colors flex items-center gap-1">API Documentation <ExternalLink className="h-3 w-3" /></Link></li>
                            <li><Link href="/seller/support/community" className="hover:text-accent transition-colors">Seller Community Forum</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Policies */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-accent" /> Platform Policies
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/seller/policies/terms" className="hover:text-accent transition-colors">Seller Terms of Service</Link></li>
                            <li><Link href="/seller/policies/authenticity" className="hover:text-accent transition-colors">Authenticity Guidelines</Link></li>
                            <li><Link href="/seller/policies/fees" className="hover:text-accent transition-colors">Commission & Fee Structure</Link></li>
                            <li><Link href="/seller/policies/returns" className="hover:text-accent transition-colors">Return & Dispute Resolution</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} SarvaHub E-Commerce Pvt Ltd. Seller Portal.</p>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> All Systems Operational
                        </span>
                        <span>v1.2.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
