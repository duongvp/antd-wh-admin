// hooks/usePurchaseOrderTableData.ts
import { useEffect, useState } from 'react';
import { getPurchaseOrderById, IPurchaseOrderBase, IPurchaseOrderDetail, IPurchaseOrderSummary } from '@/services/purchaseOrderService';

interface UsePurchaseOrderTableDataReturn {
    poInfos: Partial<IPurchaseOrderBase>;
    tableData: Partial<IPurchaseOrderDetail>[];
    poSummary: Partial<IPurchaseOrderSummary>;
    loading: boolean;
    error: string | null;
}

export function usePurchaseOrderTableData(purchaseOrderId?: number, deps: React.DependencyList = []): UsePurchaseOrderTableDataReturn {
    const [poInfos, setPoInfos] = useState<Partial<IPurchaseOrderBase>>({});
    const [tableData, setTableData] = useState<Partial<IPurchaseOrderDetail>[]>([]);
    const [poSummary, setPoSummary] = useState<Partial<IPurchaseOrderSummary>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getPurchaseOrderById(purchaseOrderId as number);
                const { items, summary, ...rest } = res;
                setTableData(items);
                setPoInfos(rest);
                setPoSummary(summary);
            } catch (err) {
                console.error(err);
                setError('Không thể tải dữ liệu đơn đặt hàng');
            } finally {
                setLoading(false);
            }
        };

        if (purchaseOrderId) {
            fetchData();
        }
        if (!purchaseOrderId) {
            setLoading(false);
        }
    }, [purchaseOrderId, ...deps]);

    return { tableData, poInfos, poSummary, loading, error };
}