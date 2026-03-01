import { create } from 'zustand';

export type ResolutionType = 'refund_original' | 'store_credit' | 'exchange';

export interface ReturnItem {
    id: string; // The order item ID
    reason?: string;
    subReason?: string;
    resolution?: ResolutionType;
    exchangeVariantId?: string; // If resolution is 'exchange'
    proofImages?: string[]; // Array of blob URLs or base64
    comments?: string;
}

interface ReturnState {
    selectedItemIds: string[];
    itemDetails: Record<string, ReturnItem>;

    // Actions
    toggleSelection: (id: string, isReturnable: boolean) => void;
    setItemDetails: (id: string, details: Partial<ReturnItem>) => void;
    addProofImage: (id: string, imageUrl: string) => void;
    removeProofImage: (id: string, index: number) => void;
    reset: () => void;
}

export const useReturnStore = create<ReturnState>((set) => ({
    selectedItemIds: [],
    itemDetails: {},

    toggleSelection: (id, isReturnable) => {
        if (!isReturnable) return;
        set((state) => {
            const isSelected = state.selectedItemIds.includes(id);
            const newIds = isSelected
                ? state.selectedItemIds.filter(i => i !== id)
                : [...state.selectedItemIds, id];

            // If selecting for the first time, initialize its details object
            let newDetails = { ...state.itemDetails };
            if (!isSelected && !newDetails[id]) {
                newDetails[id] = { id };
            }

            return { selectedItemIds: newIds, itemDetails: newDetails };
        });
    },

    setItemDetails: (id, details) => {
        set((state) => ({
            itemDetails: {
                ...state.itemDetails,
                [id]: { ...state.itemDetails[id], ...details }
            }
        }));
    },

    addProofImage: (id, imageUrl) => {
        set((state) => {
            const currentImages = state.itemDetails[id]?.proofImages || [];
            if (currentImages.length >= 3) return state; // Max 3 images per item

            return {
                itemDetails: {
                    ...state.itemDetails,
                    [id]: {
                        ...state.itemDetails[id],
                        proofImages: [...currentImages, imageUrl]
                    }
                }
            };
        });
    },

    removeProofImage: (id, index) => {
        set((state) => {
            const currentImages = state.itemDetails[id]?.proofImages || [];
            const newImages = [...currentImages];
            newImages.splice(index, 1);

            return {
                itemDetails: {
                    ...state.itemDetails,
                    [id]: {
                        ...state.itemDetails[id],
                        proofImages: newImages
                    }
                }
            };
        });
    },

    reset: () => set({ selectedItemIds: [], itemDetails: {} })
}));
