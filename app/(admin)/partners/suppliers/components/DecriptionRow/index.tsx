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
    const onChange = (key: string) => {
        console.log('Tab switched to:', key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin',
            children: <SupplierDetail record={record} />,
        },
        // {
        //     key: '2',
        //     label: 'Tab 2',
        //     children: <div>Nội dung tab 2</div>,
        // },
    ];

    return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default DecriptionRow;
