import { getInventoryCheckById, InventoryCheck, InventoryCheckBase, StockTakeItem, StockTakeSummary } from '@/services/inventoryCheckService';
import { useEffect, useState } from 'react';

interface UseInventoryCheckTableDataReturn {
    tableData: Partial<StockTakeItem>[];
    inventoryDetails: Partial<InventoryCheckBase>;
    inventorySummary: Partial<StockTakeSummary>;
    loading: boolean;
    error: string | null;
}

export function useInventoryCheckTableData(stockTakeId: number): UseInventoryCheckTableDataReturn {
    const [tableData, setTableData] = useState<Partial<StockTakeItem>[]>([]);
    const [inventoryDetails, setInventoryDetails] = useState<Partial<InventoryCheckBase>>({});
    const [inventorySummary, setInventorySummary] = useState<Partial<StockTakeSummary>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res: InventoryCheck = await getInventoryCheckById(stockTakeId);
                const { items, summary, ...rest } = res;
                setTableData(items);
                setInventoryDetails(rest);
                setInventorySummary(summary);
            } catch (err) {
                console.error(err);
                setError('Không thể tải dữ liệu kiểm kê kho');
            } finally {
                setLoading(false);
            }
        };

        if (stockTakeId) {
            fetchData();
        }
    }, [stockTakeId]);

    return {
        tableData,
        inventoryDetails,
        inventorySummary,
        loading,
        error,
    };
}
