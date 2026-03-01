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
    openAuthModal: (type?: 'login' | 'register') => void;
    closeAuthModal: () => void;
}

export const useUserStore = create<AuthState>()(
    persist(
        (set) => ({
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

            logout: () => set({
                user: null,
                accessToken: null,
                isAuthenticated: false
            }),

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
            }), // Only persist authentication data, not modal state
        }
    )
);
