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
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin',
            children: <CustomerDetail record={record} />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={items} />;
};

export default DecriptionRow;
