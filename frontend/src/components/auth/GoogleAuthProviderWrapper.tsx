'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleAuthProviderWrapper({ children }: { children: React.ReactNode }) {
    // Provide a fallback client ID so that build (SSG) won't crash when Auth modules are scanned
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy_client_id_for_build';

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
