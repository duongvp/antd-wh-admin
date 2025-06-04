"use client";
import dayjs from "dayjs";
import React, { useState, useEffect, useCallback } from "react";
import CustomTable from "@/components/ui/Table";
import type { ColumnsType } from "antd/es/table";
import SearchAndActionsBar from "@/components/shared/SearchAndActionBar";
import DecriptionTable from "./components/DecriptionRow";
import { notification } from "antd";
import { getInvoiceStatusLabel, InvoiceStatus } from "@/enums/invoice";
import FilterDrawer from "@/components/shared/FilterModal";
import { isEmpty } from "lodash";
import ReturnInvoiceModal from "./components/ReturnInvoiceModal";
import { exportReturnOrders, getReturnOrdersByPage, importReturnOrdersFromExcel, ReturnOrderApiResponse } from "@/services/returnService";
import ImportModal from "@/components/shared/ImportModal";
import GenericExportButton from "@/components/shared/GenericExportButton";
import { useAuthStore } from "@/stores/authStore";

interface DataType extends ReturnOrderApiResponse {
    key: number;
    description: React.ReactNode;
}

const formatCurrency = (value: number | string) => {
    return Number(value).toLocaleString()
};

const columns: ColumnsType<DataType> = [
    {
        title: "Mã trả hàng",
        dataIndex: "return_code",
    },
    {
        title: "Người bán",
        dataIndex: "created_by",
        ellipsis: true,
    },
    {
        title: "Thời gian khởi tạo",
        dataIndex: "created_at",
        render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
    },
    {
        title: "Khách hàng",
        dataIndex: "customer_name",
        ellipsis: true,
    },
    {
        title: "Cần trả khách",
        dataIndex: "refund_amount",
        render: formatCurrency,
        align: 'right',
    },
    {
        title: "Đã trả khách",
        dataIndex: "refund_amount", // Giả sử có trường này từ API
        render: formatCurrency,
        align: 'right',
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        render: (value) => (
            <span className={`status-${value.toLowerCase()}`}>
                {value}
            </span>
        ),
    },
];

interface InvoiceFilter {
    invoice_code?: string;
    [key: string]: any;
}

const Page = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [total, setTotal] = useState<number>(0);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [modalVisible, setModalVisible] = useState(false);
    const [filter, setFilter] = useState<InvoiceFilter>({});
    const { warehouseId } = useAuthStore((state) => state.user)

    const fetchData = useCallback(async () => {
        if (warehouseId === -1) return
        try {
            setLoading(true);
            const { current, pageSize } = pagination;
            const skip = (current - 1) * pageSize;
            const { data: apiData, total } = await getReturnOrdersByPage(pageSize, skip, filter);

            setTotal(total);

            const tableData: DataType[] = apiData.map((item) => ({
                ...item,
                key: item.return_id,
                status: getInvoiceStatusLabel(item.status as InvoiceStatus),
                description: <DecriptionTable data={item} />,
            }));

            setData(tableData);
        } catch (error) {
            api.error({
                message: "Lỗi khi tải dữ liệu",
                description: "Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.",
            });
            console.error("Lỗi fetch API:", error);
        } finally {
            setLoading(false);
        }
    }, [api, pagination, filter]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRowClick = (record: DataType) => {
        const key = record.key;
        setExpandedRowKeys((prevKeys) =>
            prevKeys.includes(key)
                ? prevKeys.filter((k) => k !== key)
                : [...prevKeys, key]
        );
    };

    const handleTableChange = (paginationInfo: any) => {
        setPagination({
            current: paginationInfo.current,
            pageSize: paginationInfo.pageSize,
        });
    };

    const handleSearch = async (value: string) => {
        setFilter({ ...filter, invoice_code: value });
    };

    const handleFilterOrder = (values: any) => {
        if (isEmpty(values)) {
            setFilter({ invoice_code: filter.invoice_code });
            return
        }
        setFilter({ ...filter, ...values });
    };

    useEffect(() => {
        if (warehouseId === -1) return
        setFilter({ ...filter, warehouse_id: warehouseId });
    }, [warehouseId]);

    return (
        <>
            {contextHolder}
            <SearchAndActionsBar
                onSearch={handleSearch}
                placeholder="Tìm theo mã phiếu trả"
                titleBtnAdd="Trả hàng"
                handleAddBtn={() => setModalVisible(true)}
                handleFilterBtn={() => setOpenFilterDrawer(true)}
                // handleImportClick={() => setOpenImportModal(true)}
                extraExportButton={
                    <GenericExportButton
                        exportService={exportReturnOrders}
                        serviceParams={[[], 1]}
                        fileNamePrefix="Danh_sach_phiếu trả hàng"
                    />
                }
            />

            <CustomTable<DataType>
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{
                    position: ["bottomRight"],
                    showSizeChanger: true,
                    total,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                }}
                onChange={handleTableChange}
                scroll={{ x: "max-content" }}
                expandable={{
                    expandedRowRender: (record) => record.description,
                    expandedRowKeys,
                    onExpand: (expanded, record) => {
                        if (expanded) {
                            setExpandedRowKeys([record.key]);
                        } else {
                            setExpandedRowKeys([]);
                        }
                    },
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: "pointer" },
                })}
                rowClassName={() => "expandable-row"}
            />

            <FilterDrawer open={openFilterDrawer} onClose={() => { setOpenFilterDrawer(false) }} handleSearch={handleFilterOrder} />
            <ReturnInvoiceModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            {/* <ImportModal
                open={openImportModal}
                onClose={() => setOpenImportModal(false)}
                title="Nhập hàng hóa từ file dữ liệu"
                notes={[
                    'Mã phiếu trả hàng luôn bắt đầu bằng cụm từ “TTIP”. Nếu bạn không nhập, hệ thống sẽ tự động thêm vào.',
                    'Hệ thống cho phép import tối đa 1.000 dòng mỗi lần.',
                ]}
                importApiFn={importReturnOrdersFromExcel}
                linkExcel="/files/danh_sach_hoa_don_mau.xlsx"
            /> */}
        </>
    );
};

export default Page;