import React from 'react';
import { Tabs } from 'antd';
import TableWithActions from './TableWithActions';
import { PurchaseOrderApiResponse } from '@/services/purchaseOrderService';
import usePurchaseOrderStore from '@/stores/purchaseOrderStore';
import { usePurchaseOrderTableData } from '@/hooks/usePurchaseOrderTableData';

interface DecriptionTableProps {
    data: PurchaseOrderApiResponse;
}

const DecriptionTable: React.FC<DecriptionTableProps> = ({ data }) => {
    const shouldReload = usePurchaseOrderStore(state => state.shouldReload);

    const {
        tableData,
        poInfos,
        poSummary,
        loading,
        error,
    } = usePurchaseOrderTableData(data.po_id, [shouldReload]);

    const tabItems = [
        {
            key: '1',
            label: 'Thông tin',
            children: <TableWithActions poDetail={tableData} poInfos={poInfos} poSummary={poSummary} />,
        },
    ];

    if (loading) return <></>

    return <Tabs defaultActiveKey="1" items={tabItems} />;
};

export default DecriptionTable;
