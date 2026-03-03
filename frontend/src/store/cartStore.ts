'use client';

import { create } from 'zustand';
import { api, ApiRequestError } from '@/lib/api';

// ─── Types ──────────────────────────────────────────────────────────

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    attributes?: string;
    color?: string;
    size?: string | null;
    sku?: string;
    stock?: number;
    sellerId?: string;
}

interface CartResponse {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
}

interface CartState {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCart: () => Promise<void>;
    addItem: (productId: string, quantity?: number, color?: string, size?: string | null) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => void;
}

// ─── Store ──────────────────────────────────────────────────────────

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    subtotal: 0,
    itemCount: 0,
    isLoading: false,
    error: null,

    fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.get<CartResponse>('/cart');
            set({
                items: data.items || [],
                subtotal: data.subtotal || 0,
                itemCount: data.itemCount || 0,
                isLoading: false,
            });
        } catch (err) {
            // If not authenticated or cart doesn't exist, just set empty
            if (err instanceof ApiRequestError && err.status === 401) {
                set({ items: [], subtotal: 0, itemCount: 0, isLoading: false });
            } else {
                set({ error: 'Failed to load cart', isLoading: false });
            }
        }
    },

    addItem: async (productId, quantity = 1, color, size) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.post<CartResponse>('/cart/items', {
                productId,
                quantity,
                color: color || null,
                size: size || null,
            });
            set({
                items: data.items || [],
                subtotal: data.subtotal || 0,
                itemCount: data.itemCount || 0,
                isLoading: false,
            });
        } catch (err) {
            const message = err instanceof ApiRequestError ? err.message : 'Failed to add item';
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    updateQuantity: async (itemId, quantity) => {
        // Optimistic update
        const prevItems = get().items;
        const updated = prevItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        );
        const newSubtotal = updated.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const newCount = updated.reduce((sum, i) => sum + i.quantity, 0);
        set({ items: updated, subtotal: newSubtotal, itemCount: newCount });

        try {
            const data = await api.patch<CartResponse>(`/cart/items/${itemId}`, { quantity });
            set({
                items: data.items || [],
                subtotal: data.subtotal || 0,
                itemCount: data.itemCount || 0,
            });
        } catch (err) {
            // Rollback
            set({ items: prevItems, error: 'Failed to update quantity' });
        }
    },

    removeItem: async (itemId) => {
        // Optimistic update
        const prevItems = get().items;
        const filtered = prevItems.filter(item => item.id !== itemId);
        const newSubtotal = filtered.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const newCount = filtered.reduce((sum, i) => sum + i.quantity, 0);
        set({ items: filtered, subtotal: newSubtotal, itemCount: newCount });

        try {
            const data = await api.delete<CartResponse>(`/cart/items/${itemId}`);
            set({
                items: data.items || [],
                subtotal: data.subtotal || 0,
                itemCount: data.itemCount || 0,
            });
        } catch (err) {
            // Rollback
            set({ items: prevItems, error: 'Failed to remove item' });
        }
    },

    clearCart: () => set({ items: [], subtotal: 0, itemCount: 0 }),
}));
