import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/orders`;

// Đây là kiểu dữ liệu API trả về
export interface OrderApiResponse {
    co_id: number
    warehouse_id: number
    order_code: string
    customer_id: number
    user_id: number
    order_date: string
    total_amount: string
    status: string
    notes: any
    customer_name: string
    created_at: Date;
    updated_at: Date;
}

export const getAllOrders = async (): Promise<OrderApiResponse[]> => {
    const url = `${API_BASE_URL}`;
    return await fetchInstance(url);
};

export const getCustomerOrderById = async (id: number): Promise<any> => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url);
};

export const createOrder = async (orderData: any) => {
    const url = `${API_BASE_URL}`;
    return await fetchInstance(url, {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const updateOrder = async (id: string, orderData: any) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'PUT',
        body: JSON.stringify(orderData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const deleteOrder = async (id: string) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'DELETE',
    });
};

