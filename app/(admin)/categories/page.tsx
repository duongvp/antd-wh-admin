"use client";
import React, { useState, useEffect } from "react";
import CustomTable from "@/components/ui/Table";
import type { ColumnsType } from "antd/es/table";
// import SearchAndActionsBar from "./components/SearchAndActionsBar";
import { CategoryApiResponse, getCategories } from "@/services/categoryService";
import SearchAndActionsBar from "@/components/shared/SearchAndActionBar";
import CategoryModal from "./components/SearchAndActionsBar/CategoryModal";
import useCategoryStore from "@/stores/categoryStore";
import { ActionType } from "@/enums/action";
import { Button, Space } from "antd";
import ConfirmButton from "@/components/ui/ConfirmButton";
import { CloseCircleFilled, DeleteOutlined, EditFilled } from "@ant-design/icons";
import ActionButton from "@/components/ui/ActionButton";

// Đây là kiểu dữ liệu cho Table (thêm key + description)
interface DataType extends CategoryApiResponse {
    key: number;
}

// Columns hiển thị
const columns: ColumnsType<DataType> = [
    {
        title: "Mã nhóm hàng",
        dataIndex: "category_id",
    },
    {
        title: "Tên nhóm",
        dataIndex: "category_name",
    },
    {
        title: "Nhóm cha",
        dataIndex: "parent_name",
    },
    {
        title: "Tương tác",
        dataIndex: "action",
        width: 100,
    },
];

const Page = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { setModal, shouldReload, setShouldReload } = useCategoryStore();

    const fetchApi = async () => {
        try {
            const apiData = await getCategories();

            // map lại dữ liệu cho Table
            const tableData: DataType[] = apiData.map((item) => ({
                ...item,
                key: Number(item.category_id), // dùng product_id làm key
                action: (
                    <Space>
                        <ActionButton
                            type='primary'
                            color='orange'
                            variant='solid'
                            icon={<EditFilled />}
                            onClick={() => setModal({ open: true, type: ActionType.UPDATE, category: item })}
                        />
                        <ConfirmButton
                            customColor="red"
                            icon={<DeleteOutlined />}
                            onConfirm={() => {
                                console.log("Hủy bỏ đã được xác nhận");
                            }}
                            confirmMessage="Bạn có chắc chắn muốn xoá nhóm hàng này? Tất cả những nhóm hàng con phụ thuộc vào nhóm này sẽ bị xoá"
                            messageWhenSuccess="Xoá thành công"
                            messageWhenError="Có lỗi xảy ra khi xoá"
                        />
                    </Space>
                )
            }));

            setData(tableData);
        } catch (error) {
            console.error("Lỗi fetch API:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    useEffect(() => {
        if (shouldReload) {
            fetchApi();
            setShouldReload(false);
        }
    }, [shouldReload]);

    return (
        <>
            <SearchAndActionsBar
                onSearch={async () => { }}
                placeholder="Theo tên nhóm hàng"
                titleBtnAdd="Nhóm hàng"
                handleAddBtn={() => { setModal({ open: true, type: ActionType.CREATE, category: null }) }}
            />
            <CustomTable<DataType>
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ position: ["bottomRight"] }}
                scroll={{ x: "max-content" }}
            />
            <CategoryModal />
        </>
    );
};

export default Page;
