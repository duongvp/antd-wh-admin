// services/userService.ts

import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users`;

export interface UserApiResponse {
    user_id: number
    username: string
    password: string
    full_name: string
    email: string
    phone: string
    is_active: number
    warehouse_id: number
    roles: { role_id: number, role_name: string }[],
    created_at: string
    updated_at: string
}

export const getUsers = async (): Promise<UserApiResponse[]> => {
    const url = API_BASE_URL;
    return await fetchInstance(url);
};

export const getUsersFollowWarehouse = async (warehouseId: number): Promise<Omit<UserApiResponse, 'roles'>[]> => {
    const url = API_BASE_URL;
    return await fetchInstance(`${url}/with-warehouses/${warehouseId}`);
};

export const createUser = async (payload: { username: string; email: string; first_name: string; last_name: string; password: string; role_id: number }) => {
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

export const updateUser = async (id: number, payload: any) => {
    const url = `${API_BASE_URL}/${id}`;
    const options = {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return await fetchInstance(url, options);
}

export const toggleUserStatus = async (id: number, payload: { status: 1 | 0 }) => {
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

export const deleteUser = async (id: number) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'DELETE',
    });
};