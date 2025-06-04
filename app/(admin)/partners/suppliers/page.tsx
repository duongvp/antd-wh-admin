"use client";
import React, { useState, useEffect } from "react";
import CustomTable from "@/components/ui/Table";
import type { ColumnsType } from "antd/es/table";
import { getAllSuppliers, SupplierApiResponse } from "@/services/supplierService";
import DecriptionRow from "./components/DecriptionRow";
import useSupplierStore from "@/stores/supplierStore";
import SearchAndActionsBar from "@/components/shared/SearchAndActionBar";
import { ActionType } from "@/enums/action";
import SupplierModal from "./components/Modal/SupplierModal";

// Đây là kiểu dữ liệu cho Table (thêm key + description)

interface Pagination {
    current?: number;
    pageSize?: number;
}

interface DataType extends SupplierApiResponse {
    key: number;
    description: React.ReactNode;
}

// Columns hiển thị
const columns: ColumnsType<DataType> = [
    {
        title: "Mã nhà cung cấp",
        dataIndex: "supplier_code",
    },
    {
        title: "Tên nhà cung cấp",
        dataIndex: "supplier_name",
    },
    {
        title: "Điện thoại",
        dataIndex: "phone",
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Trạng thái",
        dataIndex: "is_active",
        render: (value) => {
            return <span>{value ? "Hoạt động" : "Ngừng hoạt động"}</span>
        }
    },
    // {
    //     title: "Nợ cần trả hiện tại",
    //     dataIndex: "selling_price",
    //     render: (value) => {
    //         return <span>{Number(value).toLocaleString()}</span>
    //     },
    //     sorter: (a, b) => Number(a.selling_price) - Number(b.selling_price),
    // },
    // {
    //     title: "Tổng mua",
    //     dataIndex: "purchase_price",
    //     render: (value) => {
    //         return <span>{Number(value).toLocaleString()}</span>
    //     },
    //     sorter: (a, b) => Number(a.selling_price) - Number(b.selling_price),
    // },
];

const Page = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [filters, setFilters] = useState<any>({});
    const { setModal } = useSupplierStore()

    console.log('loading', loading);

    const fetchData = async (params: Pagination = {}) => {
        setLoading(true);
        try {
            const { current = 1, pageSize = 10 } = params;
            const skip = (current - 1) * pageSize;
            const response = await getAllSuppliers(filters.search);

            const tableData: DataType[] = response.map((item) => ({
                ...item,
                key: item.supplier_id,
                description: <DecriptionRow record={item} />,
            }));

            setData(tableData);
            // setTotal(response.total);
            // setPagination({
            //     current,
            //     pageSize,
            // });
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleRowClick = (record: DataType) => {
        const key = record.key;
        setExpandedRowKeys((prevKeys) =>
            prevKeys.includes(key) ? prevKeys.filter((k) => k !== key) : [...prevKeys, key]
        );
    };

    const handleSearch = async (values: any) => {
        setFilters({ ...filters, search: values });
    }

    useEffect(() => {
        fetchData();
    }, [filters.search])

    return (
        <>
            {/* <SearchAndActionsBar /> */}
            <SearchAndActionsBar
                onSearch={handleSearch}
                placeholder="Theo tên, số điện thoại nhà cung cấp"
                titleBtnAdd="Nhà cung cấp"
                handleAddBtn={() => { setModal({ open: true, type: ActionType.CREATE, suppliers: null }) }}
            />
            <CustomTable<DataType>
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ position: ["bottomRight"] }}
                scroll={{ x: "max-content" }}
                expandable={{
                    expandedRowRender: (record) => record.description,
                    expandedRowKeys: expandedRowKeys,
                    onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />
            <SupplierModal />
        </>
    );
};

export default Page;
