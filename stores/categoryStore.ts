import { ActionType } from '@/enums/action';
import { CategoryApiResponse } from '@/services/categoryService';
import { create } from 'zustand';

interface CategoryOption {
    label: string;
    value: string | number;
    labelText?: string; // Optional, used for displaying text in select options
}

interface CategoryModalState {
    open: boolean;
    title: string;
    type: ActionType | null;
    category: CategoryApiResponse | null;
}

interface CategoryStore {
    // State
    modal: CategoryModalState;
    shouldReload: boolean;
    optionsCategory: CategoryOption[];

    // Actions
    setOptionsCategory: (options: CategoryOption[]) => void;
    setModal: (partial: Partial<CategoryModalState>) => void;
    resetModal: () => void;
    setShouldReload: (value: boolean) => void;
}

const useCategoryStore = create<CategoryStore>((set, get) => ({
    modal: {
        open: false,
        title: '',
        type: null,
        category: null,
    },

    optionsCategory: [],

    setModal: (partial) => set((state) => {
        const newModal = {
            ...state.modal,
            ...partial,
            title: partial.type === ActionType.CREATE
                ? 'Thêm nhóm hàng'
                : partial.type === ActionType.UPDATE
                    ? 'Cập nhật nhóm hàng'
                    : state.modal.title
        };
        return { modal: newModal };
    }),

    resetModal: () => set({
        modal: {
            open: false,
            title: '',
            type: null,
            category: null,
        }
    }),

    shouldReload: false,
    setShouldReload: (value) => set({ shouldReload: value }),
    setOptionsCategory: (options) => set({ optionsCategory: options }),
}));

export default useCategoryStore;
