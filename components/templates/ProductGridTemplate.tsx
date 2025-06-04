// ProductSelect.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Button, Empty, Flex, InputNumber, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import SelectWithButton from '../ui/Selects/SelectWithButton';
import CustomTable from '../ui/Table';
import useProductSelect from '@/hooks/useProductSelect';
import ProductModal from '@/app/(admin)/products/components/Modal/ProductModal';
import { ColumnsType } from 'antd/es/table';
import CustomInput from '../ui/Inputs';
import Link from 'next/link';
import useProductStore from '@/stores/productStore';
import { ActionType } from '@/enums/action';

interface ImportGoodsItem {
    no: number;
    itemCode: string;
    id: number;
    itemName: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
}

interface DataType extends ImportGoodsItem {
    key: string;
}

interface ProductSelectProps {
    setTotalAmount: React.Dispatch<React.SetStateAction<number>>;
    setData?: React.Dispatch<any>;
    tableData?: any
    isViewPurchasePrice?: boolean
    disableAction?: boolean
}

const ProductSelect = ({ setTotalAmount, tableData, setData, isViewPurchasePrice = false, disableAction = false }: ProductSelectProps) => {
    console.log("🚀 ~ ProductSelect ~ tableData:", tableData)
    const [searchTerm, setSearchTerm] = useState('');
    const { setModal } = useProductStore();

    const {
        options,
        handleScroll
    } = useProductSelect(searchTerm, isViewPurchasePrice);

    console.log('options', options);

    const [dataSource, setDataSource] = useState<DataType[]>([]);

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
                    disabled={disableAction}
                />
            ),
        },
        { title: 'STT', dataIndex: 'no', key: 'no', width: 60 },
        { title: 'Mã hàng', dataIndex: 'itemCode', key: 'itemCode', render: (value) => <Link href={'#'}>{value}</Link> },
        { title: 'Tên hàng', dataIndex: 'itemName', key: 'itemName' },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 80 },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            render: (value, record) => (
                <CustomInput
                    isNumber
                    value={value}
                    onChange={(e) => handleChangeValue(record.key, 'unitPrice', Number(e.target.value))}
                    inputNumberProps={{
                        min: 1,
                        value: value,
                        onChange: (val) => handleChangeValue(record.key, 'quantity', Number(val) || 1),
                        disabled: disableAction
                    }}
                />
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            width: 140,
            render: (value, record) => (
                <CustomInput
                    isNumber
                    value={value}
                    inputNumberProps={{
                        value: Number(String(value).replace(/,/g, '')),
                        formatter: (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        parser: (val) => val?.replace(/,/g, '') || '0',
                        onChange: (val) => handleChangeValue(record.key, 'unitPrice', Number(val) || 0),
                        disabled: disableAction
                    }}
                />
            ),
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
            width: 120,
            render: (value, record) => (
                <CustomInput
                    isNumber
                    value={value}
                    inputNumberProps={{
                        min: 0,
                        value: Number(String(value).replace(/,/g, '')),
                        formatter: (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        parser: (val) => val?.replace(/,/g, '') || '0',
                        onChange: (val) => handleChangeValue(record.key, 'discount', Number(val) || 0),
                        disabled: disableAction
                    }}
                />
            ),
        },
        { title: 'Thành tiền', dataIndex: 'totalPrice', key: 'totalPrice', render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
    ];

    const handleChangeValue = (
        key: string,
        field: 'quantity' | 'unitPrice' | 'discount',
        value: number | string
    ) => {
        console.log("value: ", value);
        setDataSource((prevData) =>
            prevData.map((item) => {
                if (item.key === key) {
                    const newItem = { ...item, [field]: value };

                    const donGiaNumber = Number(newItem.unitPrice);
                    const soLuongNumber = Number(newItem.quantity);
                    const giamGiaNumber = Number(newItem.discount);

                    const total = (donGiaNumber * soLuongNumber) - giamGiaNumber;

                    return {
                        ...newItem,
                        totalPrice: total,
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

        if (selectedOption && selectedProduct) {
            setDataSource((prevData) => {
                const existingIndex = prevData.findIndex(
                    (item) => item.itemCode === selectedProduct.product_code
                );

                if (existingIndex !== -1) {
                    // If product already exists, increase quantity
                    const updatedData = [...prevData];
                    const currentItem = updatedData[existingIndex];
                    const unitPrice = Number(currentItem.unitPrice);
                    const newQuantity = currentItem.quantity + 1;
                    const newTotal = unitPrice * newQuantity - Number(currentItem.discount);

                    updatedData[existingIndex] = {
                        ...currentItem,
                        quantity: newQuantity,
                        totalPrice: newTotal,
                    };

                    return updatedData;
                } else {
                    // If product does not exist, add new item
                    const unitPrice = Number(isViewPurchasePrice ? selectedProduct.purchase_price : selectedProduct.selling_price);

                    return [
                        ...prevData,
                        {
                            key: selectedOption.value,
                            no: prevData.length + 1,
                            id: selectedProduct.product_id, // Add id property.
                            itemCode: selectedProduct.product_code,
                            itemName: selectedProduct.product_name,
                            unit: selectedProduct.unit_name,
                            quantity: 1,
                            unitPrice: unitPrice,
                            discount: 0,
                            totalPrice: unitPrice,
                        },
                    ];
                }
            });
        }
    };

    useEffect(() => {
        const total = dataSource.reduce((acc, item) => {
            const unitPrice = Number(String(item.unitPrice).replace(/,/g, ''));
            const quantity = Number(item.quantity);
            const discount = Number(item.discount);

            return acc + (unitPrice * quantity) - discount;
        }, 0);

        setTotalAmount(total);
        if (setData)
            setData(dataSource);
    }, [dataSource]);

    useEffect(() => {
        if (tableData) {
            const newData = tableData.map((item: any, index: number) => {
                // const unitPrice = Number(item.unit_price || item.selling_price);
                const unitPrice = Number(item.unit_price);
                const totalPrice = Number(item.total_price);
                return {
                    id: item.product_id,
                    key: item.product_code,
                    no: index,
                    itemCode: item.product_code,
                    itemName: item.product_name,
                    unit: item.unit_name,
                    quantity: item.quantity,
                    unitPrice: unitPrice,
                    discount: item.discount,
                    totalPrice: totalPrice,
                };
            });

            setDataSource(newData);
        }
    }, [tableData])

    return (
        <div style={{ height: "100%" }}>
            <Flex vertical style={{ height: "100%" }}>
                <div style={{ marginBottom: 16, width: '40%' }}>
                    <SelectWithButton
                        disabled={disableAction}
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
                <div style={{ flex: 1, position: "relative" }} className={!dataSource.length ? "table-no-data" : ""}>
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

export default ProductSelect;
