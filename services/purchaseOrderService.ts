import { POStatus } from "@/enums/purchaseOrder";
import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/purchase-orders`;

// Đây là kiểu dữ liệu API trả về
export interface PurchaseOrderApiResponse {
    po_id: number;
    warehouse_id: number;
    po_code: string;
    supplier_id: number;
    supplier_name: string;
    user_id: number;
    order_date: Date;
    total_amount: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

export interface IPurchaseOrderSummary {
    total_items: number
    total_quantity: number
    subtotal: string
    discount_amount: string
    total_amount: string
    amount_paid: string
    debt_amount: string
}

export interface IPurchaseOrderDetail {
    key: number
    pod_id: number
    po_id: number
    product_id: number
    quantity: number
    unit_price: string
    total_price: string
    product_name: string
    product_code: string
    barcode: string
    purchase_price: string
    selling_price: string
    unit_name: string
    category_name: string
    discount: number
    importPrice: number
    line_total: number
}


export interface IPurchaseOrderBase {
    po_id: number
    warehouse_id: number
    po_code: string
    supplier_id: number
    user_id: number
    order_date: Date
    total_amount: string
    status: POStatus
    notes: any
    created_at: Date
    updated_at: Date
    supplier_name: string
    supplier_code: string
    supplier_phone: string
    supplier_email: string
    supplier_address: string
    created_by: string
    username: string
    warehouse_name: string
    warehouse_address: string
}

export interface IFullPurchaseOrderResponse extends IPurchaseOrderBase {
    summary: IPurchaseOrderSummary
    items: IPurchaseOrderDetail[]
}

export const importPurchaseOrdersFromExcel = async (formatData: any): Promise<any> => {
    return await fetchInstance(`${API_BASE_URL}/import`, {
        method: "POST",
        body: formatData,
    });
};

export const exportPurchaseOrders = async (purchaseOrderIds: Array<string | number>, warehouseId?: number): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/export`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            purchaseOrderIds,
            warehouseId
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to export products');
    }

    return await response.blob();
};


export const getPurchaseOrdersByPage = async (
    limit: number,
    skip: number,
    filter: any
): Promise<{ data: PurchaseOrderApiResponse[]; total: number }> => {
    return await fetchInstance(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit, skip, filter }),
    });
};

export const getPurchaseOrderById = async (id: number): Promise<IFullPurchaseOrderResponse> => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url);
};

export const createPurchaseOrder = async (purchaseOrderData: any) => {
    const url = `${API_BASE_URL}`;
    return await fetchInstance(url, {
        method: 'POST',
        body: JSON.stringify(purchaseOrderData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const updatePurchaseOrder = async (id: number, purchaseOrderData: any) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'PUT',
        body: JSON.stringify(purchaseOrderData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const deletePurchaseOrder = async (id: string) => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'DELETE',
    });
};
