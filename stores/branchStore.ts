import { ActionType } from '@/enums/action';
import { WarehouseApiResponse } from '@/services/branchService';
import { create } from 'zustand';


interface WarehouseModalState {
    open: boolean;
    title: string;
    type: ActionType | null;
    warehouse: WarehouseApiResponse | null;
}

interface WarehouseStore {
    // State
    modal: WarehouseModalState;
    shouldReload: boolean;
    setModal: (partial: Partial<WarehouseModalState>) => void;
    resetModal: () => void;
    setShouldReload: (value: boolean) => void
}

const useBranchStore = create<WarehouseStore>((set, get) => ({
    // Modal state
    modal: {
        open: false,
        title: '',
        type: null,
        warehouse: null,
    },

    // Actions
    setModal: (partial) => set((state) => {
        const newModal = {
            ...state.modal,
            ...partial,
            // Auto-update title based on type
            title: partial.type === ActionType.CREATE
                ? 'Thêm chi nhánh'
                : partial.type === ActionType.UPDATE
                    ? 'Cập nhật chi nhánh'
                    : state.modal.title
        };
        return { modal: newModal };
    }),

    resetModal: () => set({
        modal: {
            open: false,
            title: '',
            type: null,
            warehouse: null,
        }
    }),

    // 🔥 Implement reload state
    shouldReload: false,
    setShouldReload: (value) => set({ shouldReload: value }),
}));

export default useBranchStore;

