import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: {
        userId: number;
        username: string;
        warehouseId: number;
        warehouseName: string;
        permissions: string[];
    };
    setUser: (userData: any) => void;
    clearUser: () => void;
    hasPermission: (permission: string) => boolean;
}

const defaultUser = {
    userId: -1,
    username: '',
    warehouseId: -1,
    warehouseName: '',
    permissions: []
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: defaultUser,

            setUser: (userData) =>
                set({
                    user: {
                        userId: userData.userId,
                        username: userData.username,
                        warehouseId: userData.warehouseId,
                        warehouseName: userData.warehouseName,
                        permissions: userData.permissions
                    }
                }),

            clearUser: () => set({ user: defaultUser }),

            hasPermission: (permission) => {
                if (typeof window === 'undefined') return false;
                const { user } = get();
                if (!user) return false;
                if (user.permissions.includes('*')) return true;
                return user.permissions.includes(permission);
            }
        }),
        {
            name: 'auth-storage', // key trong localStorage
            partialize: (state) => ({ user: state.user }), // chỉ lưu user
            onRehydrateStorage: () => (state, error) => {
                console.log('Rehydrating state:', state)
                if (error) {
                    console.error('Error during rehydration:', error)
                }
            },
        }
    )
);
