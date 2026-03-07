import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'consumer' | 'seller' | 'admin';
    avatar?: string;
    sellerProfile?: any;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;
    authModalType: 'login' | 'register';
    authModalMessage: string | null;

    // Actions
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: Partial<User>) => void;
    openAuthModal: (type?: 'login' | 'register', message?: string | null) => void;
    closeAuthModal: () => void;
    fetchUser: () => Promise<void>;
}

export const useUserStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isAuthModalOpen: false,
            authModalType: 'login',
            authModalMessage: null,

            login: (user, token) => set({
                user,
                accessToken: token,
                isAuthenticated: true,
                isAuthModalOpen: false,
                authModalMessage: null
            }),

            logout: () => {
                // Fire-and-forget API call
                const token = get().accessToken;
                if (token) {
                    fetch('/api/v1/auth/logout', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        credentials: 'include',
                    }).catch(() => { /* ignore */ });
                }

                // Clear cart store
                try {
                    // Dynamic import to avoid circular dependency
                    import('@/store/cartStore').then(m => m.useCartStore.getState().clearCart());
                } catch { /* ignore */ }

                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false
                });
            },

            setUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null,
            })),

            openAuthModal: (type = 'login', message = null) => set({
                isAuthModalOpen: true,
                authModalType: type,
                authModalMessage: message
            }),

            closeAuthModal: () => set({
                isAuthModalOpen: false,
                authModalMessage: null
            }),

            fetchUser: async () => {
                const token = get().accessToken;
                if (!token) return;
                try {
                    const res = await fetch('/api/v1/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        set({ user: data.user });
                    }
                } catch {
                    // ignore
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
