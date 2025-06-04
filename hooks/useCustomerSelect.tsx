// hooks/useProductSelect.ts
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { Tag } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const LIMIT = 50; // Số lượng sản phẩm mỗi lần gọi API

interface CustomerOption {
    value: number;
    labelText: string;
    disabled?: boolean;
    data: CustomerApiResponse;
    label: React.ReactNode;
}

import React from 'react';
import { CustomerApiResponse, getCustomersByPage } from '@/services/customerService';

export default function useCustomerSelect(searchTerm: string) {
    const [data, setData] = useState<CustomerApiResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [options, setOptions] = useState<CustomerOption[]>([]);

    const fetchProducts = async (skip: number, filter: any = {}) => {
        setLoading(true);
        try {
            const result = await getCustomersByPage(LIMIT, skip, filter);
            setData(prev => skip === 0 ? result.data : [...prev, ...result.data]);
            setHasMore(result.data.length === LIMIT);
        } catch (error) {
            console.error("Fetch error:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const delaySearch = debounce(() => {
            fetchProducts(0, { search: searchTerm });
        }, 300);
        delaySearch();
        return () => delaySearch.cancel();
    }, [searchTerm]);

    useEffect(() => {
        if (data.length > 0) {
            const newOptions = data.map((item, index) => ({
                value: item.customer_id,
                labelText: `${item.customer_name} - ${item.phone}`, // item.customer_name,
                // disabled: item.max_stock <= 0,
                data: item,
                label: (`${item.customer_name} - ${item.phone}`)
            }));
            setOptions(newOptions);
        } else {
            setOptions([]);
        }
    }, [data]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 30 && hasMore && !loading) {
            fetchProducts(data.length, { search: searchTerm });
        }
    };

    return {
        options,
        loading,
        handleScroll,
    };
}
