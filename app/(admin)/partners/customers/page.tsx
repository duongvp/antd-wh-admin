"use client";
import React, { useState, useEffect } from "react";
import CustomTable from "@/components/ui/Table";
import type { ColumnsType } from "antd/es/table";
// import SearchAndActionsBar from "./components/SearchAndActionsBar";
import DecriptionRow from "./components/DecriptionRow";
import useCustomerStore from "@/stores/customerStore";
import { CustomerApiResponse, getCustomersByPage } from "@/services/customerService";
import SearchAndActionsBar from "@/components/shared/SearchAndActionBar";
import CustomerModal from "./components/Modal/CustomerModal";
import { ActionType } from "@/enums/action";

interface Pagination {
    current?: number;
    pageSize?: number;
}

// Đây là kiểu dữ liệu cho Table (thêm key + description)
interface DataType extends CustomerApiResponse {
    key: number;
    description: React.ReactNode;
}

// Columns hiển thị
const columns: ColumnsType<DataType> = [
    {
        title: "Mã khách hàng",
        dataIndex: "customer_code",
    },
    {
        title: "Tên khách hàng",
        dataIndex: "customer_name",
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
            return <span>{value ? "Hoạt động" : "Ngừng hoạt động"}</span>;
        }
    },
];

const Page = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ current: 1, pageSize: 10 });
    const [total, setTotal] = useState<number>(0);
    const [filters, setFilters] = useState<any>({});
    const { setModal } = useCustomerStore()


    const fetchData = async (params: Pagination = {}) => {
        setLoading(true);
        try {
            const { current = 1, pageSize = 10 } = params;
            const skip = (current - 1) * pageSize;
            const response = await getCustomersByPage(pageSize, skip, filters);

            const tableData: DataType[] = response.data.map((item) => ({
                ...item,
                key: item.customer_id,
                description: <DecriptionRow record={item} />,
            }));

            setData(tableData);
            setTotal(response.total);
            setPagination({
                current,
                pageSize,
            });
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

    const handleTableChange = (newPagination: any) => {
        fetchData({
            current: newPagination.current,
            pageSize: newPagination.pageSize
        });
    };

    const handleSearch = async (values: any) => {
        setFilters({ ...filters, search: values });
    }

    useEffect(() => {
        fetchData();
    }, [filters.search])

    return (
        <>
            <SearchAndActionsBar
                onSearch={handleSearch}
                placeholder="Theo tên, số điện thoại khách hàng"
                titleBtnAdd="Khách hàng"
                handleAddBtn={() => { setModal({ open: true, type: ActionType.CREATE, customer: null }) }}
            />
            <CustomTable<DataType>
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: "max-content" }}
                expandable={{
                    expandedRowRender: (record) => record.description,
                    expandedRowKeys: expandedRowKeys,
                    onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                pagination={{
                    ...pagination,
                    total,
                    showSizeChanger: true,
                    position: ["bottomRight"],
                }}
                onChange={handleTableChange}
            />
            <CustomerModal />
        </>
    );
};

export default Page;
