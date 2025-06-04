"use client";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import CustomTable from "@/components/ui/Table";
import type { ColumnsType } from "antd/es/table";
import { exportProducts, getProductsByPage, ProductApiResponse } from "@/services/productService";
import DecriptionRow from "./components/DecriptionRow";
import SearchAndActionsBar from "@/components/shared/SearchAndActionBar";
import ProductModal from "./components/Modal/ProductModal";
import FilterProductDrawer from "./components/FilterProductDrawer";
import ImportProductModal from "./components/Modal/ImportProductModal";
import ExportModal from "@/components/shared/ExportModal";
import GenericExportButton from "@/components/shared/GenericExportButton";
import useProductStore from "@/stores/productStore";
import { ActionType } from "@/enums/action";
import { useAuthStore } from "@/stores/authStore";

// Đây là kiểu dữ liệu cho Table (thêm key + description)
interface DataType extends ProductApiResponse {
    key: number;
    // description: React.ReactNode;
}

interface Pagination {
    current?: number;
    pageSize?: number;
}

// Columns hiển thị
const columns: ColumnsType<DataType> = [
    {
        title: "Mã hàng",
        dataIndex: "product_code",
    },
    {
        title: "Tên hàng",
        dataIndex: "product_name",
    },
    {
        title: "Giá bán",
        dataIndex: "selling_price",
        render: (value) => {
            return <span>{Number(value).toLocaleString()}</span>
        },
        sorter: (a, b) => Number(a.selling_price) - Number(b.selling_price),
    },
    {
        title: "Giá vốn",
        dataIndex: "purchase_price",
        render: (value) => {
            return <span>{Number(value).toLocaleString()}</span>
        },
        sorter: (a, b) => Number(a.selling_price) - Number(b.selling_price),
    },
    {
        title: "Tồn kho",
        dataIndex: "stock",
    },
    // {
    //     title: "Tổng tồn kho",
    //     dataIndex: "total_stock",
    // },

    {
        title: "Thời gian khởi tạo",
        dataIndex: "created_at",
        render: (value) => dayjs(value).format("DD/MM/YY HH:mm"),
    },
    {
        title: "Trạng thái",
        dataIndex: "is_active",
        render: (value) => {
            return <span>{value ? "Hoạt động" : "Ngừng hoạt động"}</span>
        }
    },
];


const Page = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ current: 1, pageSize: 10 });
    const [total, setTotal] = useState<number>(0);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Array<string | number>>([1, 2, 3]);
    const { warehouseId } = useAuthStore((state) => state.user)
    const [filters, setFilters] = useState<any>({ warehouse_id: warehouseId });

    const { setModal, shouldReload, setShouldReload } = useProductStore();

    const fetchData = async (params: Pagination = {}) => {
        if (warehouseId === -1) return
        setLoading(true);
        try {
            const { current = 1, pageSize = 10 } = params;
            const skip = (current - 1) * pageSize;
            const response = await getProductsByPage(pageSize, skip, filters);

            const tableData: DataType[] = response.data.map((item) => ({
                ...item,
                key: item.product_id,
                // description: <DecriptionRow record={item} />,
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

    const handleFilterOrder = (values: any) => {
        setFilters({ search: filters.search, ...values });
    };

    useEffect(() => {
        fetchData();
    }, [filters])

    useEffect(() => {
        if (shouldReload) {
            fetchData();
            setShouldReload(false);
        }
    }, [shouldReload]);

    useEffect(() => {
        if (warehouseId === -1) return
        setFilters({ ...filters, warehouse_id: warehouseId });
    }, [warehouseId]);

    return (
        <>
            <SearchAndActionsBar
                onSearch={handleSearch}
                placeholder="Theo mã hàng, tên hàng"
                handleAddBtn={() => setModal({ open: true, type: ActionType.CREATE, product: null })}
                handleFilterBtn={() => setOpenFilterDrawer(true)}
                handleImportClick={() => setOpenImportModal(true)}
                extraExportButton={
                    <GenericExportButton
                        exportService={exportProducts}
                        serviceParams={[[], 1]}
                        fileNamePrefix="Danhsachsanpham"
                    />
                }
            />
            <CustomTable<DataType>
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{
                    ...pagination,
                    total,
                    showSizeChanger: true,
                    position: ["bottomRight"],
                }}
                scroll={{ x: "max-content" }}
                expandable={{
                    expandedRowRender: (record) => <DecriptionRow record={record} />,
                    expandedRowKeys: expandedRowKeys,
                    onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                onChange={handleTableChange}
            />
            <FilterProductDrawer open={openFilterDrawer} onClose={() => { setOpenFilterDrawer(false) }} handleSearch={handleFilterOrder} />
            <ImportProductModal open={openImportModal} onClose={() => setOpenImportModal(false)} />
            <ProductModal />
        </>
    );
};

export default Page;
