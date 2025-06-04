'use client';

import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import BranchDetail from './BranchDetail';
import { WarehouseApiResponse } from '@/services/branchService';

interface DecriptionRowProps {
    record: WarehouseApiResponse;
}

const DecriptionRow: React.FC<DecriptionRowProps> = ({ record }) => {
    const onChange = (key: string) => {
        console.log('Tab switched to:', key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin',
            children: <BranchDetail record={record} />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default DecriptionRow;
