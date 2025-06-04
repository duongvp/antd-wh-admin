import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import TableWithActions from './TableWithActions';
import { getPurchaseOrderById, IPurchaseOrderBase, IPurchaseOrderDetail, IPurchaseOrderSummary, PurchaseOrderApiResponse } from '@/services/purchaseOrderService';

interface DecriptionTableProps {
    data: PurchaseOrderApiResponse;
}

const DecriptionTable: React.FC<DecriptionTableProps> = ({ data }) => {
    const [poInfos, setPoInfos] = useState<Partial<IPurchaseOrderBase>>({});
    const [tableData, setTableData] = useState<Partial<IPurchaseOrderDetail>[]>([]);
    const [poSummary, setPoSummary] = useState<Partial<IPurchaseOrderSummary>>({});

    useEffect(() => {
        const fetchApiTableData = async () => {
            const res = await getPurchaseOrderById(data.po_id);
            console.log("🚀 ~ fetchApiTableData ~ res:", res)
            const { items, summary, ...rest } = res
            setTableData(items);
            setPoInfos(rest)
            setPoSummary(summary);
        };
        fetchApiTableData()
    }, [data.po_id]);

    const tabItems = [
        {
            key: '1',
            label: 'Thông tin',
            children: <TableWithActions poDetail={tableData} poInfos={poInfos} poSummary={poSummary} />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={tabItems} />;
};

export default DecriptionTable;
