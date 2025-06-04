
import { ActionType } from '@/enums/action';
import { CustomerApiResponse } from '@/services/customerService';
import { create } from 'zustand';

interface CustomerModalState {
    open: boolean;
    title: string;
    type: ActionType | null;
    customer: CustomerApiResponse | null;
}

interface CustomerStore {
    // State
    modal: CustomerModalState;
    shouldReload: boolean;
    setModal: (partial: Partial<CustomerModalState>) => void;
    resetModal: () => void;
    setShouldReload: (value: boolean) => void
}

const useCustomerStore = create<CustomerStore>((set, get) => ({
    // Modal state
    modal: {
        open: false,
        title: '',
        type: null,
        customer: null,
    },

    // Actions
    setModal: (partial) => set((state) => {
        const newModal = {
            ...state.modal,
            ...partial,
            // Auto-update title based on type
            title: partial.title || (partial.type === ActionType.CREATE
                ? 'Thêm khách hàng'
                : partial.type === ActionType.UPDATE
                    ? 'Cập nhật khách hàng'
                    : state.modal.title)
        };
        return { modal: newModal };
    }),

    resetModal: () => set({
        modal: {
            open: false,
            title: '',
            type: null,
            customer: null,
        }
    }),

    shouldReload: false,
    setShouldReload: (value) => set({ shouldReload: value }),
}));

export default useCustomerStore;