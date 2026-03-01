"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Package,
    ShoppingCart,
    Settings,
    HelpCircle,
    MessageSquare,
    ArrowLeftRight,
    ShieldCheck
} from "lucide-react";

const mainNav = [
    { name: "Dashboard", href: "/seller/dashboard", icon: BarChart3 },
    { name: "Products", href: "/seller/products", icon: Package },
    { name: "Orders", href: "/seller/orders", icon: ShoppingCart },
    { name: "Returns & Refunds", href: "/seller/returns", icon: ArrowLeftRight },
];

const secondaryNav = [
    { name: "Support Center", href: "/seller/support/center", icon: HelpCircle },
    { name: "Feedback", href: "/seller/feedback", icon: MessageSquare },
    { name: "Trust & Compliance", href: "/seller/compliance", icon: ShieldCheck },
    { name: "Settings", href: "/seller/settings", icon: Settings },
];

export function SellerSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 pt-20 bg-card border-r border-border shadow-sm flex flex-col z-40">
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">

                {/* Main Navigation */}
                <div className="space-y-1">
                    <h3 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-3 px-3">
                        Store Management
                    </h3>
                    {mainNav.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                    ? "bg-primary text-primary-foreground font-medium"
                                    : "text-foreground hover:bg-muted"
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Secondary Navigation */}
                <div className="space-y-1">
                    <h3 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-3 px-3">
                        Help & Settings
                    </h3>
                    {secondaryNav.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                    ? "bg-primary text-primary-foreground font-medium"
                                    : "text-foreground hover:bg-muted"
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Seller Profile Mini */}
            <div className="p-4 border-t border-border mt-auto">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                        SF
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">SarvaHub Fashions</p>
                        <p className="text-xs text-muted-foreground truncate">Verified Pro Seller</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
