import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/invoices`;

// Đây là kiểu dữ liệu API trả về
export interface InvoiceApiResponse {
    invoice_id: number;
    warehouse_id: number;
    invoice_code: string;
    customer_id: number | null;
    user_id: number;
    invoice_date: string;
    total_amount: string;
    status: string;
    notes: string | null;
    customer_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface InvoiceDetailResponse {
    invoice_detail_id: number;
    invoice_id: number;
    product_id: number;
    quantity: number;
    unit_price: string;
    total_price: string;
    product_name: string;
    product_code: string;
    barcode: string;
    selling_price: string;
}

export interface FullInvoiceResponse extends InvoiceApiResponse {
    summary: {
        total_items: number;
        total_quantity: number;
        total_amount: number;
        discount: number;
        amount_paid: number;
    };
    items: InvoiceDetailResponse[];
}

export const importInvoicesFromExcel = async (formatData: any): Promise<any> => {
    return await fetchInstance(`${API_BASE_URL}/import`, {
        method: "POST",
        body: formatData,
    });
};

export const exportInvoices = async (invoiceIds: Array<string | number | undefined>, warehouseId?: number): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/export`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            invoiceIds,
            warehouseId
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to export products');
    }

    return await response.blob();
};

export const getAllInvoices = async (): Promise<InvoiceApiResponse[]> => {
    const url = `${API_BASE_URL}`;
    return await fetchInstance(url);
};

export const getInvoicesByPage = async (limit: number, skip: number, filter: any): Promise<{ data: InvoiceApiResponse[], total: number }> => {
    return await fetchInstance(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit, skip, filter }),
    });
};


export const getInvoiceById = async (id: number): Promise<FullInvoiceResponse> => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url);
};

export const createInvoice = async (invoiceData: any): Promise<InvoiceApiResponse> => {
    const url = `${API_BASE_URL}`;
    return await fetchInstance(url, {
        method: 'POST',
        body: JSON.stringify(invoiceData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const updateInvoice = async (id: number, invoiceData: any): Promise<InvoiceApiResponse> => {
    const url = `${API_BASE_URL}/${id}`;
    return await fetchInstance(url, {
        method: 'PUT',
        body: JSON.stringify(invoiceData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const cancelInvoice = async (id: number) => {
    const url = `${API_BASE_URL}/cancel/${id}`;
    return await fetchInstance(url, {
        method: 'POST',
    });
};
