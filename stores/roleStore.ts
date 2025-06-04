import { ActionType } from '@/enums/action';
import { RoleApiResponse } from '@/services/roleService';
import { create } from 'zustand';


interface RoleModalState {
    open: boolean;
    title: string;
    type: ActionType | null;
    role: RoleApiResponse | null;
}

interface RoleStore {
    // State
    modal: RoleModalState;
    shouldReload: boolean;
    setModal: (partial: Partial<RoleModalState>) => void;
    resetModal: () => void;
    setShouldReload: (value: boolean) => void
}

const useRoleStore = create<RoleStore>((set, get) => ({
    // Modal state
    modal: {
        open: false,
        title: '',
        type: null,
        role: null,
    },

    // Actions
    setModal: (partial) => set((state) => {
        const newModal = {
            ...state.modal,
            ...partial,
            // Auto-update title based on type
            title: partial.type === ActionType.CREATE
                ? 'Thêm vai trò'
                : partial.type === ActionType.UPDATE
                    ? 'Cập nhật vai trò'
                    : state.modal.title
        };
        return { modal: newModal };
    }),

    resetModal: () => set({
        modal: {
            open: false,
            title: '',
            type: null,
            role: null,
        }
    }),

    // 🔥 Implement reload state
    shouldReload: false,
    setShouldReload: (value) => set({ shouldReload: value }),
}));

export default useRoleStore;

