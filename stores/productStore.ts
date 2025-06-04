import { ActionType } from '@/enums/action';
import { ProductApiResponse } from '@/services/productService';
import { create } from 'zustand';

interface ProductModalState {
    open: boolean;
    title: string;
    type: ActionType | null;
    product: ProductApiResponse | null;
}

interface ProductStore {
    // State
    modal: ProductModalState;
    shouldReload: boolean;
    setModal: (partial: Partial<ProductModalState>) => void;
    resetModal: () => void;
    setShouldReload: (value: boolean) => void
}

const useProductStore = create<ProductStore>((set, get) => ({
    // Modal state
    modal: {
        open: false,
        title: '',
        type: null,
        product: null,
    },

    // Actions
    setModal: (partial) => set((state) => {
        const newModal = {
            ...state.modal,
            ...partial,
            // Auto-update title based on type
            title: partial.title || (partial.type === ActionType.CREATE
                ? 'Thêm sản phẩm'
                : partial.type === ActionType.UPDATE
                    ? 'Cập nhật sản phẩm'
                    : state.modal.title)
        };
        return { modal: newModal };
    }),

    resetModal: () => set({
        modal: {
            open: false,
            title: '',
            type: null,
            product: null,
        }
    }),

    // 🔥 Implement reload state
    shouldReload: false,
    setShouldReload: (value) => set({ shouldReload: value }),
}));

export default useProductStore;
