// services/categoryService.ts

import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/categories`;

export interface CategoryApiResponse {
    category_id: number;
    category_name: string;
}

export const getCategories = async (): Promise<CategoryApiResponse[]> => {
    const url = API_BASE_URL;
    return await fetchInstance(url);
};

export const getCategoriesByPage = async (filter: any): Promise<CategoryApiResponse[]> => {
    return await fetchInstance(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter),
    });
};

export const createCategory = async (payload: { category_name: string }) => {
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

export const updateCategory = async (id: number, payload: any) => {
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

export const deleteCategory = async (id: number) => {
    const url = `${API_BASE_URL}/${id}`;
    const options = {
        method: 'DELETE',
    };
    return await fetchInstance(url, options);
};
