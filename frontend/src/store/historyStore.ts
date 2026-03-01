import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type HistoryState = {
    searchedKeywords: string[];
    recentlyViewedProducts: { id: string; name: string; image: string; price: number }[];
    addSearchKeyword: (keyword: string) => void;
    addRecentlyViewed: (product: { id: string; name: string; image: string; price: number }) => void;
    clearHistory: () => void;
};

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            searchedKeywords: [],
            recentlyViewedProducts: [],

            addSearchKeyword: (keyword) =>
                set((state) => {
                    // Prevent empty queries or duplicates
                    if (!keyword.trim() || state.searchedKeywords.includes(keyword)) return state;

                    // Keep only the last 10 search terms
                    const newKeywords = [keyword, ...state.searchedKeywords].slice(0, 10);
                    return { searchedKeywords: newKeywords };
                }),

            addRecentlyViewed: (product) =>
                set((state) => {
                    // Remove if it already exists to move it to the front
                    const filtered = state.recentlyViewedProducts.filter((p) => p.id !== product.id);
                    // Keep only the last 10 viewed items
                    const newProducts = [product, ...filtered].slice(0, 10);
                    return { recentlyViewedProducts: newProducts };
                }),

            clearHistory: () => set({ searchedKeywords: [], recentlyViewedProducts: [] }),
        }),
        {
            name: 'sarvahub-history-storage', // Key used in localStorage
        }
    )
);
