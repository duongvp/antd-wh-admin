import { create } from 'zustand';

interface InventoryCheckStore {
    shouldReload: boolean;
    setShouldReload: (value: boolean) => void
}

const useInventoryCheckStore = create<InventoryCheckStore>((set, get) => ({
    shouldReload: false,
    setShouldReload: (value) => set({ shouldReload: value }),
}));

export default useInventoryCheckStore;