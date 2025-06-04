'use client';

import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { CustomerApiResponse } from '@/services/customerService';
import CustomerDetail from './CustomerDetail';

interface DecriptionRowProps {
    record: CustomerApiResponse;
}

const DecriptionRow: React.FC<DecriptionRowProps> = ({ record }) => {
    const onChange = (key: string) => {
        console.log('Tab switched to:', key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin',
            children: <CustomerDetail record={record} />,
        },
        {
            key: '2',
            label: 'Lịch sử mua hàng',
            children: <div>Nội dung tab 2</div>,
        },
    ];

    return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default DecriptionRow;
