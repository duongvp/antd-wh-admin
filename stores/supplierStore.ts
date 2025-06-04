import { ActionType } from '@/enums/action';
import { SupplierApiResponse } from '@/services/supplierService';
import { create } from 'zustand';

interface SupplierModalState {
    open: boolean;
    title: string;
    type: ActionType | null;
    suppliers: SupplierApiResponse | null; // Đổi tên từ suppliers -> suppliers (singular)
}

interface SupplierStore {
    modal: SupplierModalState;
    shouldReload: boolean;
    setModal: (partial: Partial<SupplierModalState>) => void;
    resetModal: () => void;
    setShouldReload: (value: boolean) => void
}

const useSupplierStore = create<SupplierStore>((set, get) => ({
    // Modal state
    modal: {
        open: false,
        title: '',
        type: null,
        suppliers: null,
    },
    setModal: (partial) => set((state) => {
        const newModal = {
            ...state.modal,
            ...partial,
            // Auto-update title based on type
            title: partial.title || (partial.type === ActionType.CREATE
                ? 'Thêm nhà cung cấp'
                : partial.type === ActionType.UPDATE
                    ? 'Cập nhật nhà cung cấp'
                    : state.modal.title)
        };
        return { modal: newModal };
    }),

    resetModal: () => set({
        modal: {
            open: false,
            title: '',
            type: null,
            suppliers: null,
        }
    }),

    shouldReload: false,
    setShouldReload: (value) => set({ shouldReload: value }),
}));

export default useSupplierStore;