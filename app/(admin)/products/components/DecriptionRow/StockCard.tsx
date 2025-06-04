import React, { useEffect } from 'react';
import CustomTable from '@/components/ui/Table';
import { ColumnsType } from 'antd/es/table';
import { useAuthStore } from '@/stores/authStore';
import { getStockCard } from '@/services/stockCard';
import dayjs from 'dayjs';
import useProductStore from '@/stores/productStore';
import { Typography } from 'antd';

const { Text } = Typography;

// Sửa lại prop nhận vào cho StockCard
interface TableWithActionsProps {
    data: any;
}

const StockCard: React.FC<TableWithActionsProps> = ({ data }) => {
    const [dataSource, setDataSource] = React.useState<any[]>([]);
    const { warehouseId } = useAuthStore((state) => state.user);

    const columns: ColumnsType = [
        {
            title: 'Chứng từ',
            dataIndex: 'document_code',
            key: 'document_code',
            width: 200,
            render: (value: any) => {
                return (
                    <Text copyable>
                        {value}
                    </Text>
                )
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'transaction_date',
            key: 'transaction_date',
            render: (value: any) => {
                return dayjs(value).format("DD/MM/YY HH:mm")
            }
        },
        { title: 'Loại giao dịch', dataIndex: 'transaction_type', key: 'transaction_type', width: 200 },
        {
            title: 'Giá GD',
            dataIndex: 'unit_price',
            key: 'unit_price',
            width: 200,
            render: (value: any) => {
                if (value === null) return ''
                return Number(value).toLocaleString();
            }
        },
        {
            title: 'Giá vốn',
            dataIndex: 'unit_cost',
            key: 'unit_cost',
            width: 200,
            render: (value: any) => {
                return Number(value).toLocaleString();
            }
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: 200 },
        { title: 'Tồn cuối', dataIndex: 'ending_balance', key: 'ending_balance', width: 200 },
    ];

    const fetchData = async () => {
        try {
            const response = await getStockCard(data.product_id, warehouseId);
            const newDataSource = response.data.map((item: any) => ({
                ...item,
                key: item.stock_card_id
            }))
            setDataSource(newDataSource ?? []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if (warehouseId === -1) return
        fetchData()
    }, [warehouseId, data])

    return (
        <div>
            <CustomTable
                bordered={true}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                size='small'
            />
        </div>
    );
};

export default StockCard;

