import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'consumer' | 'seller' | 'admin';
    avatar?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;
    authModalType: 'login' | 'register';

    // Actions
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: Partial<User>) => void;
    openAuthModal: (type?: 'login' | 'register') => void;
    closeAuthModal: () => void;
}

export const useUserStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isAuthModalOpen: false,
            authModalType: 'login',

            login: (user, token) => set({
                user,
                accessToken: token,
                isAuthenticated: true,
                isAuthModalOpen: false
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

            openAuthModal: (type = 'login') => set({
                isAuthModalOpen: true,
                authModalType: type
            }),

            closeAuthModal: () => set({
                isAuthModalOpen: false
            })
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
