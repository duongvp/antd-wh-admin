import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/customers`;

// Đây là kiểu dữ liệu API trả về
export interface CustomerApiResponse {
    customer_id: number;
    customer_code: string;
    customer_name: string;
    contact_name: string;
    email: string;
    phone: string;
    address: string;
    area: string;
    ward: string;
    created_at: Date;
    updated_at: Date;
}

export interface GetAllCustomerResponse {
    data: CustomerApiResponse[];
    total: number;
}

export const getAllCustomers = async (search: string = ''): Promise<CustomerApiResponse[]> => {
    const url = `${API_BASE_URL}?search=${search}`;
    return await fetchInstance(url);
};

export const getCustomersByPage = async (limit: number, skip: number, filter: any): Promise<GetAllCustomerResponse> => {
    const url = `${API_BASE_URL}?limit=${limit}&skip=${skip}&filter=${JSON.stringify(filter)}`;
    return await fetchInstance(url);
};

export const getCustomerById = async (id: string): Promise<CustomerApiResponse> => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url);
};

export const createCustomer = async (customerData: any) => {
    const url = `${API_BASE_URL}`;
    return await fetchInstance(url, {
        method: 'POST',
        body: JSON.stringify(customerData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const updateCustomer = async (id: string, customerData: any) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'PUT',
        body: JSON.stringify(customerData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const deleteCustomer = async (id: string) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'DELETE',
    });
};
