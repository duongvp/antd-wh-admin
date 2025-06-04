import { ActionType } from '@/enums/action';
import { UserApiResponse } from '@/services/userService';
import { create } from 'zustand';

interface UserModalState {
    open: boolean;
    title: string;
    type: ActionType | null;
    user: UserApiResponse | null;
}

interface UserStore {
    // State
    modal: UserModalState;
    shouldReload: boolean;
    setModal: (partial: Partial<UserModalState>) => void;
    resetModal: () => void;
    setShouldReload: (value: boolean) => void
}

const useUserStore = create<UserStore>((set, get) => ({
    // Modal state
    modal: {
        open: false,
        title: '',
        type: null,
        user: null,
    },

    // Actions
    setModal: (partial) => set((state) => {
        const newModal = {
            ...state.modal,
            ...partial,
            // Auto-update title based on type
            title: partial.type === ActionType.CREATE
                ? 'Thêm người dùng'
                : partial.type === ActionType.UPDATE
                    ? 'Cập nhật người dùng'
                    : state.modal.title
        };
        return { modal: newModal };
    }),

    resetModal: () => set({
        modal: {
            open: false,
            title: '',
            type: null,
            user: null,
        }
    }),

    // 🔥 Implement reload state
    shouldReload: false,
    setShouldReload: (value) => set({ shouldReload: value }),
}));

export default useUserStore;
