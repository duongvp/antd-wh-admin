import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/suppliers`;

// Đây là kiểu dữ liệu API trả về
export interface SupplierApiResponse {
    supplier_id: number;
    supplier_code: string;
    supplier_name: string;
    contact_name: string;
    email: string;
    phone: string;
    address: string;
    area: string;
    ward: string
    created_at: Date;
    updated_at: Date;
}

export const getAllSuppliers = async (search: string = ''): Promise<SupplierApiResponse[]> => {
    const url = `${API_BASE_URL}?search=${search}`;
    return await fetchInstance(url);
};

export const getSuppliersByPage = async (limit: number, skip: number, filter: any): Promise<SupplierApiResponse[]> => {
    const url = `${API_BASE_URL}?limit=${limit}&skip=${skip}&filter=${JSON.stringify(filter)}`;
    return await fetchInstance(url);
};

export const getSupplierById = async (id: string): Promise<SupplierApiResponse> => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url);
};

export const createSupplier = async (supplierData: any) => {
    const url = `${API_BASE_URL}`;
    return await fetchInstance(url, {
        method: 'POST',
        body: JSON.stringify(supplierData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const updateSupplier = async (id: string, supplierData: any) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'PUT',
        body: JSON.stringify(supplierData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const deleteSupplier = async (id: string) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'DELETE',
    });
};
