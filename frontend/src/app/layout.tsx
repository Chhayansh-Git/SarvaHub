import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { FloatingChatbot } from '@/components/support/FloatingChatbot';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SarvaHub | Premium Authenticated Marketplace',
  description: 'The trusted destination for verified luxury and premium goods.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <AuthModal />
          {/* Floating Orb Particles Background (Global) */}
          <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] opacity-50 mix-blend-screen animate-pulse-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-slate-400/20 rounded-full blur-[96px] opacity-30 mix-blend-screen" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-[100px] opacity-40 mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
          <FloatingChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
