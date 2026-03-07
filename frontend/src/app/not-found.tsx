"use client";

import Link from "next/link";
import { GoogleAuthProviderWrapper } from "@/components/auth/GoogleAuthProviderWrapper";

export default function NotFound() {
    return (
        <GoogleAuthProviderWrapper>
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background text-foreground">
                <h2 className="text-4xl font-black mb-4">404 - Page Not Found</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                    The link you followed may be broken, or the page may have been removed.
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors font-semibold"
                >
                    Return to Home
                </Link>
            </div>
        </GoogleAuthProviderWrapper>
    );
}
