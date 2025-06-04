"use client";
import React, { useState, useEffect } from "react";
import CustomTable from "@/components/ui/Table";
import type { ColumnsType } from "antd/es/table";
// import SearchAndActionsBar from "./components/SearchAndActionsBar";
import { getUnits, UnitApiResponse } from "@/services/unitService";
import { Space } from "antd";
import SearchAndActionsBar from "@/components/shared/SearchAndActionBar";

// Đây là kiểu dữ liệu cho Table (thêm key + description)
interface DataType extends UnitApiResponse {
    key: number;
}

// Columns hiển thị
const columns: ColumnsType<DataType> = [
    {
        title: "Mã Đơn vị",
        dataIndex: "unit_id",
    },
    {
        title: "Tên đơn vị",
        dataIndex: "unit_name",
    },
    {
        title: "Action",
        key: "action",
        render: () => (
            <Space size="middle">
                <a>Delete</a>
            </Space>
        ),
    },
];

const Page = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const apiData = await getUnits();

                // map lại dữ liệu cho Table
                const tableData: DataType[] = apiData.map((item, index) => ({
                    ...item,
                    key: index, // dùng product_id làm key
                }));

                setData(tableData);
            } catch (error) {
                console.error("Lỗi fetch API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, []);


    return (
        <>
            <SearchAndActionsBar
                onSearch={async () => { }}
                placeholder="Theo tên đơn vị tính"
                titleBtnAdd="Đơn vị tính"
                handleAddBtn={() => { }}
            />
            <CustomTable<DataType>
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ position: ["bottomRight"] }}
                scroll={{ x: "max-content" }}
            />
        </>
    );
};

export default Page;
