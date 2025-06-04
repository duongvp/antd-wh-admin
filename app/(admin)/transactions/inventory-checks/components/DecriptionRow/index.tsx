import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import TableWithActions from './TableWithActions';
import { getInventoryCheckById, InventoryCheckBase, StockTakeItem, StockTakeSummary } from '@/services/inventoryCheckService';

interface DecriptionTableProps {
    data: any;
}

const DecriptionTable: React.FC<DecriptionTableProps> = ({ data }) => {
    const [tableData, setTableData] = useState<StockTakeItem[]>([]);
    const [inventoryCheckDetails, setInventoryCheckDetails] = useState<Partial<InventoryCheckBase>>({});
    const [inventoryCheckSummary, setInventoryCheckSummary] = useState<Partial<StockTakeSummary>>({});

    useEffect(() => {
        const fetchApiTableData = async () => {
            const res = await getInventoryCheckById(data.stock_take_id);
            const { items, summary, ...rest } = res
            setTableData(items);
            setInventoryCheckDetails(rest);
            setInventoryCheckSummary(summary);
        };
        fetchApiTableData()
    }, [data.stock_take_id]); // Changed from po_id to stock_take_id

    const tabItems = [
        {
            key: '1',
            label: 'Thông tin',
            children: <TableWithActions
                tableData={tableData}
                inventoryCheckDetails={inventoryCheckDetails}
                inventoryCheckSummary={inventoryCheckSummary}
            />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={tabItems} />;
};

export default DecriptionTable;