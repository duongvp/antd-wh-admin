import { create } from 'zustand';

interface IPurchaseOrderStore {
    shouldReload: boolean;
    setShouldReload: (value: boolean) => void;
}

const usePurchaseOrderStore = create<IPurchaseOrderStore>((set, get) => ({
    shouldReload: false,
    setShouldReload: (value) => set({ shouldReload: value }),
}));

export default usePurchaseOrderStore;