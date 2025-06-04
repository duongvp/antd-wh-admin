import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getAllSuppliers } from '@/services/supplierService';

export interface SupplierOption {
    label: string;
    value: string | number;
}

export const useSupplierSelect = () => {
    const [options, setOptions] = useState<SupplierOption[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getAllSuppliers();
                const formattedOptions = data.map((item) => ({
                    label: `${item.supplier_name} - ${item.phone}`,
                    value: item.supplier_id,
                    labelText: `${item.supplier_name} - ${item.phone}`
                }));
                setOptions(formattedOptions);
            } catch (error) {
                console.error('Error fetching supplier:', error);
                message.error('Không thể tải danh sách nhà cung cấp');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { options, loading };
};
