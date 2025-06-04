// services/warehouseService.ts

import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/warehouses`;


export interface WarehouseApiResponse {
    warehouse_id: number;
    warehouse_name: string;
    address: string;
    phone: string;
    is_active: number;
    email: string;
    total_users: number;
    user_names: string[]
    created_at?: Date;
}

export const getWarehouses = async (): Promise<WarehouseApiResponse[]> => {
    const url = API_BASE_URL;
    return await fetchInstance(url);
};

export const getWarehouseById = async (id: number): Promise<WarehouseApiResponse> => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url);
};

export const createWarehouse = async (payload: any) => {
    const url = API_BASE_URL;
    const options = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return await fetchInstance(url, options);
};

export const updateWarehouse = async (id: number, payload: any) => {
    const url = `${API_BASE_URL}/${id}`;
    const options = {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return await fetchInstance(url, options);
};

export const deleteWarehouse = async (id: number) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'DELETE',
    });
};


export const toggleWarehouseStatus = async (id: number, payload: { status: 1 | 0 }) => {
    const url = `${API_BASE_URL}/toggle/${id}`;
    const options = {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return await fetchInstance(url, options);
};
