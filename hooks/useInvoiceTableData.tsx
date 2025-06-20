// hooks/useInvoiceTableData.ts
import { useEffect, useState } from 'react';
import { getInvoiceById } from '@/services/invoiceService';
import { IInvoiceDetail, IInvoiceTableData } from '@/types/invoice';

export function useInvoiceTableData(invoiceId: number, deps: React.DependencyList = []) {
    const [tableData, setTableData] = useState<Partial<IInvoiceTableData>[]>([]);
    const [invoiceDetails, setInvoiceDetails] = useState<Partial<IInvoiceDetail>>({});
    const [invoiceSummary, setInvoiceSummary] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getInvoiceById(invoiceId);
                const { items, summary, ...rest } = res;
                setTableData(items);
                setInvoiceDetails(rest);
                setInvoiceSummary(summary);
            } catch (err) {
                console.error(err);
                setError('Không thể tải dữ liệu hóa đơn');
            } finally {
                setLoading(false);
            }
        };

        if (invoiceId) {
            fetchData();
        }
    }, [invoiceId, ...deps]);

    return { tableData, invoiceDetails, invoiceSummary, loading, error };
}
