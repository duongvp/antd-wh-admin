import React from 'react';
import { Tabs, Spin, Alert } from 'antd';
import TableWithActions from './TableWithActions';
import { InvoiceApiResponse } from '@/services/invoiceService';
import { useInvoiceTableData } from '@/hooks/useInvoiceTableData';
import { useAuthStore } from '@/stores/authStore';

interface DecriptionTableProps {
    data: InvoiceApiResponse;
    options: {
        value: number;
        labelText: string;
        label: string;
    }[];
}

const InvoiceDescriptionTable: React.FC<DecriptionTableProps> = ({ data, options }) => {
    const {
        tableData,
        invoiceDetails,
        invoiceSummary,
        loading,
        error,
    } = useInvoiceTableData(data.invoice_id);
    const { warehouseId } = useAuthStore(state => state.user)

    if (!data) return null;
    // if (loading) return <Spin tip="Đang tải dữ liệu..." fullscreen />;
    if (error) return <Alert type="error" message={error} />;

    const tabItems = [
        {
            key: '1',
            label: 'Thông tin',
            children: (
                <TableWithActions
                    data={tableData}
                    invoiceDetails={invoiceDetails}
                    invoiceSummary={invoiceSummary}
                    options={options}
                />
            ),
        },
    ];

    return <Tabs defaultActiveKey="1" items={tabItems} />;
};

export default InvoiceDescriptionTable;