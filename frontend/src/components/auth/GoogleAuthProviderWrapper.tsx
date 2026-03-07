'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleAuthProviderWrapper({ children }: { children: React.ReactNode }) {
    // If the Client ID is missing, we render the children directly (fallback mode)
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        return <>{children}</>;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
