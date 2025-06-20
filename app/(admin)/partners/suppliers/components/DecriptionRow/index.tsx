'use client';

import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import SupplierDetail from './SupplierDetail';
import { SupplierApiResponse } from '@/services/supplierService';

interface DecriptionRowProps {
    record: SupplierApiResponse;
}

const DecriptionRow: React.FC<DecriptionRowProps> = ({ record }) => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin',
            children: <SupplierDetail record={record} />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={items} />;
};

export default DecriptionRow;
