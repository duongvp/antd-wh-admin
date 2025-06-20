"use client";
import dayjs from "dayjs";
import React, { useState, useEffect, useCallback } from "react";
import CustomTable from "@/components/ui/Table";
import type { ColumnsType } from "antd/es/table";
import SearchAndActionsBar from "@/components/shared/SearchAndActionBar";
import DecriptionTable from "./components/DecriptionRow";
import { exportInvoices, getInvoicesByPage, importInvoicesFromExcel, InvoiceApiResponse } from "@/services/invoiceService";
import { notification } from "antd";
import { getInvoiceStatusLabel, InvoiceStatus } from "@/enums/invoice";
import FilterDrawer from "@/components/shared/FilterModal";
import { isEmpty } from "lodash";
import ImportModal from "@/components/shared/ImportModal";
import GenericExportButton from "@/components/shared/GenericExportButton";
import { useAuthStore } from "@/stores/authStore";
import { getUsersFollowWarehouse } from "@/services/userService";
import { PermissionKey } from "@/types/permissions";
import useInvoiceStore from "@/stores/invoiceStore";
import { Status } from "@/enums/status";

interface DataType extends InvoiceApiResponse {
    key: number;
    description: React.ReactNode;
}

interface InvoiceFilter {
    invoice_code?: string;
    [key: string]: any;
}

const columns: ColumnsType<DataType> = [
    {
        title: "Mã đặt hàng",
        dataIndex: "invoice_code",
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
        title: "Tổng tiền",
        dataIndex: "total_amount",
        render: (value) => Number(value).toLocaleString(),
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        width: 150,
        render: (value) => (
            <span className={`status-${value.toLowerCase()}`}>
                {value}
            </span>
        ),
    },
];

const Page = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [total, setTotal] = useState<number>(0);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [openImportModal, setOpenImportModal] = useState(false);
    const { warehouseId } = useAuthStore((state) => state.user)
    const hasPermission = useAuthStore(state => state.hasPermission);
    const [filter, setFilter] = useState<InvoiceFilter>({ warehouse_id: warehouseId, status: Status.RECEIVED });
    const { setShouldReload, shouldReload } = useInvoiceStore()

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
        setFilter({ invoice_code: filter.invoice_code, ...values });
    };

    const handleCreateInvoice = () => window.open('/transactions/invoices/create', '_blank')

    const handleImportClick = () => setOpenImportModal(true);

    const fetchData = useCallback(async () => {
        if (warehouseId === -1) return
        try {
            setLoading(true);
            const { current, pageSize } = pagination;
            const skip = (current - 1) * pageSize;
            const { data: apiData, total } = await getInvoicesByPage(pageSize, skip, filter);

            const apiUserData = await getUsersFollowWarehouse(warehouseId);
            const options = apiUserData.map((item: any) => ({ value: item.user_id, labelText: item.username, label: item.full_name }));

            setTotal(total);

            const tableData: DataType[] = apiData.map((item) => ({
                ...item,
                key: item.invoice_id,
                status: getInvoiceStatusLabel(item.status as InvoiceStatus),
                description: <DecriptionTable data={item} options={options} />,
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

    useEffect(() => {
        if (warehouseId === -1) return
        setFilter({ ...filter, warehouse_id: warehouseId });
    }, [warehouseId]);

    useEffect(() => {
        if (shouldReload) {
            fetchData();
            setShouldReload(false);
        }
    }, [shouldReload])

    return (
        <>
            {contextHolder}
            <SearchAndActionsBar
                onSearch={handleSearch}
                placeholder="Tìm theo mã phiếu hoá đơn"
                titleBtnAdd="Hoá đơn"
                handleImportClick={hasPermission(PermissionKey.INVOICE_CREATE) ? handleImportClick : undefined}
                handleAddBtn={hasPermission(PermissionKey.INVOICE_IMPORT) ? handleCreateInvoice : undefined}
                handleFilterBtn={() => setOpenFilterDrawer(true)}
                extraExportButton={
                    hasPermission(PermissionKey.INVOICE_EXPORT) && (
                        <GenericExportButton
                            exportService={exportInvoices}
                            serviceParams={[[], warehouseId]}
                            fileNamePrefix="Danh_sach_hoa_don_"
                        />
                    )
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
            <ImportModal
                open={openImportModal}
                onClose={() => setOpenImportModal(false)}
                title="Tạo hóa đơn từ file dữ liệu"
                notes={[
                    'Mã hóa đơn luôn bắt đầu bằng cụm từ “HDIP”. Nếu bạn không nhập, hệ thống sẽ tự động thêm vào.',
                    'Hệ thống cho phép import tối đa 500 dòng mỗi lần.',
                    'Đảm bảo tồn kho của những hàng hóa liên quan vẫn đáp ứng đủ.',
                ]}
                importApiFn={importInvoicesFromExcel}
                linkExcel="/files/danh_sach_hoa_don_mau.xlsx"
                setShouldReload={setShouldReload}
            />
        </>
    );
};

export default Page;