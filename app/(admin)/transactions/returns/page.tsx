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
import { exportReturnOrders, getReturnOrdersByPage, ReturnOrderApiResponse } from "@/services/returnService";
import GenericExportButton from "@/components/shared/GenericExportButton";
import { useAuthStore } from "@/stores/authStore";
import { PermissionKey } from "@/types/permissions";
import useReturnStore from "@/stores/returnStore";
import { Status } from "@/enums/status";

interface DataType extends ReturnOrderApiResponse {
    key: number;
    description: React.ReactNode;
}

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
        title: "Trạng thái",
        dataIndex: "status",
        render: (value) => (
            <span className={`status-${value.toLowerCase()}`}>
                {value}
            </span>
        ),
    },
];

interface IReturnFilter {
    return_code: string;
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
    const hasPermission = useAuthStore(state => state.hasPermission);
    const { warehouseId } = useAuthStore((state) => state.user)
    const { shouldReload, setShouldReload } = useReturnStore()
    const [filter, setFilter] = useState<IReturnFilter>({ return_code: "", status: Status.RECEIVED });

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
        setFilter({ ...filter, return_code: value });
    };

    const handleFilterOrder = (values: any) => {
        console.log("🚀 ~ handleFilterOrder ~ values:", values)
        if (isEmpty(values)) {
            setFilter({ return_code: filter.return_code });
            return
        }
        setFilter({ return_code: filter.return_code, ...values });
    };

    const handleAddBtn = () => {
        setModalVisible(true);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (shouldReload) {
            fetchData()
            setShouldReload(false)
        }
    }, [shouldReload])

    useEffect(() => {
        if (warehouseId === -1) return
        setFilter({ ...filter, warehouse_id: warehouseId });
    }, [warehouseId]);

    return (
        <>
            {contextHolder}
            <SearchAndActionsBar
                onSearch={handleSearch}
                placeholder="Tìm theo mã phiếu trả, mã hoá đơn"
                titleBtnAdd="Trả hàng"
                handleAddBtn={hasPermission(PermissionKey.RETURN_PROCESS) ? handleAddBtn : undefined}
                handleFilterBtn={() => setOpenFilterDrawer(true)}
                extraExportButton={
                    hasPermission(PermissionKey.RETURN_EXPORT) && (
                        <GenericExportButton
                            exportService={exportReturnOrders}
                            serviceParams={[[], warehouseId]}
                            fileNamePrefix="Danh_sach_phiếu trả hàng"
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
            <ReturnInvoiceModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </>
    );
};

export default Page;