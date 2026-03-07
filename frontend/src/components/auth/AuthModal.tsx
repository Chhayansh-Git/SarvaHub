'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function AuthModal() {
    const { isAuthModalOpen, authModalType, authModalMessage, closeAuthModal, openAuthModal, login } = useUserStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const endpoint = authModalType === 'login' ? '/auth/login' : '/auth/register';
            const body: Record<string, unknown> = { email, password };
            if (authModalType === 'register') {
                body.name = name;
                body.role = 'consumer';
            }

            const data = await api.post<{
                user: { id: string; name: string; email: string; role: 'consumer' | 'seller' | 'admin'; avatar?: string };
                token: string;
            }>(endpoint, body);

            login(data.user, data.token);

            // Sync cart after login
            try {
                const { useCartStore } = await import('@/store/cartStore');
                useCartStore.getState().fetchCart();
            } catch { /* cart sync is non-critical */ }

            // Reset form
            setName('');
            setEmail('');
            setPassword('');
            closeAuthModal();

            // Role-based redirect after login
            if (data.user.role === 'seller') {
                router.push('/seller/dashboard');
            } else if (data.user.role === 'admin') {
                router.push('/admin');
            }
        } catch (err: any) {
            setError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    if (!isAuthModalOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeAuthModal}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl border border-border/50"
                >
                    {/* Close Button */}
                    <button
                        onClick={closeAuthModal}
                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 border border-accent/20">
                                <ShieldCheck className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="text-2xl font-heading font-black">
                                {authModalType === 'login' ? 'Welcome Back' : 'Create an Account'}
                            </h2>
                            <p className="text-muted-foreground mt-2 text-sm">
                                {authModalType === 'login'
                                    ? 'Enter your credentials to access your account'
                                    : 'Join SarvaHub to access premium luxury collections'}
                            </p>
                        </div>

                        {authModalMessage && (
                            <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-foreground">{authModalMessage}</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {authModalType === 'register' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/50"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/50"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                                    {authModalType === 'login' && (
                                        <a href="#" className="text-xs font-semibold text-accent hover:underline">Forgot?</a>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative group overflow-hidden rounded-xl p-[1px] mt-6"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-accent via-accent/50 to-accent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative bg-background/90 backdrop-blur-sm px-4 py-3 rounded-xl flex items-center justify-center">
                                    <span className="font-bold tracking-wide text-foreground group-hover:text-accent transition-colors">
                                        {isLoading
                                            ? 'Processing...'
                                            : (authModalType === 'login' ? 'Sign In' : 'Create Account')}
                                    </span>
                                </div>
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            {authModalType === 'login' ? (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => openAuthModal('register')}
                                        className="font-bold text-foreground hover:text-accent transition-colors"
                                    >
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => openAuthModal('login')}
                                        className="font-bold text-foreground hover:text-accent transition-colors"
                                    >
                                        Log in
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="mt-8 pt-6 border-t border-border/50 text-center">
                            <p className="text-xs text-muted-foreground mb-4">Are you a luxury verified seller?</p>
                            <a
                                href="/seller/onboarding"
                                onClick={closeAuthModal}
                                className="inline-flex items-center justify-center w-full py-2.5 rounded-xl border border-accent/30 text-accent font-semibold hover:bg-accent/5 transition-colors text-sm"
                            >
                                Apply for Seller Account
                            </a>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
