// ProductSelect.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Button, Empty, Flex, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import SelectWithButton from '../ui/Selects/SelectWithButton';
import CustomTable from '../ui/Table';
import useProductSelect from '@/hooks/useProductSelect';
import ProductModal from '@/app/(admin)/products/components/Modal/ProductModal';
import { ColumnsType } from 'antd/es/table';
import CustomInput from '../ui/Inputs';
import Link from 'next/link';
import { StockTakeItem } from '@/services/inventoryCheckService';
import useProductStore from '@/stores/productStore';
import { ActionType } from '@/enums/action';

interface ImportGoodsItem {
    no: number;
    itemCode: string;
    itemName: string;
    unit: string;
    quantity: number;
    tonkho: number;
    sll: number;
    unitPrice: string;
    totalPrice: string;
}

interface DataType extends ImportGoodsItem {
    key: string;
}

interface ProductSelectProps {
    setTotalActualQuantity: React.Dispatch<React.SetStateAction<number>>;
    setData: React.Dispatch<any>
    tableData: Partial<StockTakeItem>[]
}

const InventoryCheckSelect = ({ setTotalActualQuantity, setData, tableData }: ProductSelectProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const {
        options,
        handleScroll,
    } = useProductSelect(searchTerm, true);

    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const { setModal } = useProductStore();

    const columns: ColumnsType<DataType> = [
        {
            title: "",
            key: "action",
            width: 0,
            render: (_, record) => (
                <Button
                    icon={<DeleteOutlined />}
                    className="custom-delete-btn"
                    style={{
                        border: 0,
                        backgroundColor: "transparent",
                    }}
                    onClick={() => handleDelete(record.key)}
                />
            ),
        },
        { title: 'STT', dataIndex: 'no', key: 'no', width: 60 },
        { title: 'Mã hàng', dataIndex: 'itemCode', key: 'itemCode', render: (value) => <Link href={'#'}>{value}</Link> },
        { title: 'Tên hàng', dataIndex: 'itemName', key: 'itemName' },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 80 },
        { title: 'Tồn kho', dataIndex: 'tonkho', key: 'tonkho', width: 100 },
        {
            title: 'Thực tế',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            render: (value, record) => (
                <CustomInput
                    isNumber
                    value={value}
                    inputNumberProps={{
                        value: Number(String(value).replace(/,/g, '')),
                        formatter: (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        parser: (val) => val?.replace(/,/g, '') || '0',
                        onChange: (val) => handleChangeValue(record.key, 'quantity', Number(val) || 0),
                    }}
                />
            ),
        },
        { title: 'SL lệch', dataIndex: 'sll', key: 'sll', width: 80 },
        { title: 'Giá trị lệch', dataIndex: 'totalPrice', key: 'totalPrice' },
    ];

    const handleChangeValue = (
        key: string,
        field: keyof DataType,
        value: number | string
    ) => {
        setDataSource((prevData) =>
            prevData.map((item) => {
                if (item.key === key) {
                    const newItem = { ...item, [field]: value };

                    const soLuongNumber = newItem.quantity;
                    const tonkhoNumber = newItem.tonkho;

                    const sll = soLuongNumber - tonkhoNumber;
                    const totalPrice = (sll * Number(String(newItem.unitPrice).replace(/,/g, ''))); // Ví dụ: mỗi lệch 1 sản phẩm tính 1000đ, bạn chỉnh công thức thực tế

                    return {
                        ...newItem,
                        sll: sll,
                        totalPrice: totalPrice.toLocaleString(),
                    };
                }
                return item;
            })
        );
    };

    const handleDelete = (key: string) => {
        setDataSource((prevData) => {
            const updated = prevData.filter((item) => item.key !== key);

            // Cập nhật lại STT sau khi xoá
            return updated.map((item, index) => ({
                ...item,
                no: index + 1,
            }));
        });
    };

    const handleSelect = (value: string | number) => {
        const selectedOption = options.find((item) => item.value === value);
        const selectedProduct = selectedOption?.data;
        console.log("🚀 ~ handleSelect ~ selectedProduct:", selectedProduct)
        if (selectedOption && selectedProduct) {
            setDataSource((prevData) => {
                const existingIndex = prevData.findIndex(
                    (item) => item.itemCode === selectedProduct.product_code
                );

                if (existingIndex !== -1) {
                    return prevData
                } else {
                    // If product does not exist, add new item
                    const unitPrice = Number(selectedProduct.purchase_price);

                    return [
                        ...prevData,
                        {
                            key: selectedOption.value,
                            no: prevData.length + 1,
                            id: selectedProduct.product_id,
                            itemCode: selectedProduct.product_code,
                            itemName: selectedProduct.product_name,
                            unit: selectedProduct.unit_name,
                            quantity: selectedProduct.stock,
                            tonkho: selectedProduct.stock,
                            unitPrice: unitPrice.toLocaleString(),
                            discount: '0',
                            sll: 0,
                            totalPrice: '0',
                        },
                    ];
                }
            });
        }
    };

    useEffect(() => {
        const total = dataSource.reduce((acc, item) => {
            const quantity = Number(item.quantity);

            return acc + quantity;
        }, 0);

        setTotalActualQuantity(total);
        setData(dataSource);
    }, [dataSource]);

    useEffect(() => {
        if (tableData) {
            const newData = tableData.map((item, index) => {
                return {
                    no: index + 1,
                    key: `${item.product_id ?? ''}`,
                    id: item.product_id,
                    itemCode: item.product_code ?? '',
                    itemName: item.product_name ?? '',
                    unit: item.unit_name ?? '',
                    quantity: item.actual_quantity ?? 0,
                    tonkho: item.system_quantity ?? 0,
                    unitPrice: Number(item.purchase_price ?? 0).toLocaleString(),
                    discount: '0',
                    sll: item.variance ?? 0,
                    totalPrice: Number(item.value_variance ?? 0).toLocaleString(),
                }
            });

            setDataSource(newData);
        }
    }, [tableData])

    return (
        <div style={{ height: "100%" }}>
            <Flex vertical style={{ height: "100%" }}>
                <div style={{ marginBottom: 16, width: '40%' }}>
                    <SelectWithButton
                        options={options}
                        style={{ width: '100%' }}
                        placeholder="---Tìm hàng hoá theo mã hoặc tên---"
                        onSearch={setSearchTerm}
                        onAddClick={() => setModal({ open: true, type: ActionType.CREATE, product: null })}
                        onPopupScroll={handleScroll}
                        notFoundContent={
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Không có kết quả phù hợp"
                            />
                        }
                        onSelect={handleSelect}

                    />
                </div>
                <div style={{ flex: 1 }} className={!dataSource.length ? "table-no-data" : ""}>
                    <CustomTable<DataType>
                        style={{ height: "100%", borderRadius: 8, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                        columns={columns}
                        dataSource={dataSource}
                        loading={false}
                        pagination={false}
                        scroll={{ x: "max-content" }}
                        locale={{
                            emptyText: null
                        }}
                    />
                    {!dataSource.length && (
                        <div style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <p>Thêm sản phẩm từ file excel</p>
                            <a href="#">Tải về file mẫu: Excel file</a>
                            <div style={{ marginTop: 16 }}>
                                <Upload showUploadList={false}>
                                    <Button icon={<UploadOutlined />}>Chọn file dữ liệu</Button>
                                </Upload>
                            </div>
                        </div>
                    )}
                </div>
            </Flex>
            <ProductModal />
        </div>
    );
};

export default InventoryCheckSelect;
