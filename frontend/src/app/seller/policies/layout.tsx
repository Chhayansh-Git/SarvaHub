import { GoogleAuthProviderWrapper } from "@/components/auth/GoogleAuthProviderWrapper";

export default function SellerPoliciesLayout({ children }: { children: React.ReactNode }) {
    return <GoogleAuthProviderWrapper>{children}</GoogleAuthProviderWrapper>;
}
