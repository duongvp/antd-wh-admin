import { useEffect, useState } from 'react';
import { getReturnOrderById } from '@/services/returnService';

export function useReturnTableData(returnId: number, deps: React.DependencyList = []) {
    const [tableData, setTableData] = useState<any>([]);
    const [returnOrderDetails, setReturnOrderDetails] = useState<any>({});
    const [returnOrderSummary, setReturnOrderSummary] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getReturnOrderById(returnId);
                const { items, summary, ...rest } = res;
                setTableData(items.map((item: any) => ({ ...item, key: item.return_detail_id })));
                setReturnOrderDetails(rest);
                setReturnOrderSummary({ ...summary, discount_amount: summary.discount_total || 0 });
            } catch (err) {
                console.error(err);
                setError('Không thể tải dữ liệu hóa đơn');
            } finally {
                setLoading(false);
            }
        };

        if (returnId) {
            fetchData();
        }
    }, [returnId, ...deps]);

    return { tableData, returnOrderDetails, returnOrderSummary, loading, error };
}
