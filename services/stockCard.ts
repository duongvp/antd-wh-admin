import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/stock-cards`;


export const getStockCard = async (product_id: number, warehouse_id: number, pageSize: number, skip: number): Promise<any> => {
    const url = `${API_BASE_URL}/${product_id}/${warehouse_id}?limit=${pageSize}&skip=${skip}`;
    return await fetchInstance(url);
};

