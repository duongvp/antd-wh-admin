import React, { use, useEffect, useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type TabItem = {
    title: string;
    key: string;
    component: React.ReactNode;
};

interface BillTabsProps {
    initialTabs: TabItem[];
    defaultComponent: () => React.ReactNode; // callback để tái tạo component
}

const BillTabs: React.FC<BillTabsProps> = ({ initialTabs, defaultComponent }) => {
    console.log("🚀 ~ initialTabs:", initialTabs)
    const [tabs, setTabs] = useState<TabItem[]>(initialTabs);
    const [activeKey, setActiveKey] = useState(initialTabs[0]?.key || "");

    const handleAdd = () => {
        const nextIndex = tabs.length + 1;
        const newKey = `${nextIndex}`;
        const newTab: TabItem = {
            title: `Hóa đơn ${nextIndex}`,
            key: newKey,
            component: defaultComponent(), // tái tạo component
        };
        setTabs([...tabs, newTab]);
        setActiveKey(newKey);
    };

    const handleRemove = (targetKey: string) => {
        const newTabs = tabs.filter((tab) => tab.key !== targetKey);
        setTabs(newTabs);
        if (targetKey === activeKey && newTabs.length > 0) {
            setActiveKey(newTabs[newTabs.length - 1].key);
        }
    };

    const onChange = (key: string) => {
        if (key === "add_tab") {
            handleAdd();
        } else {
            setActiveKey(key);
        }
    };

    const items: TabsProps["items"] = [
        ...tabs.map((tab) => ({
            label: tab.title,
            key: tab.key,
            children: tab.component,
            closable: true,
        })),
        {
            label: <PlusOutlined />,
            key: "add_tab",
            children: null,
            closable: false,
        },
    ];

    useEffect(() => {
        if (initialTabs.length > 1) {
            setTabs(initialTabs);
            setActiveKey(initialTabs[1].key);
        }
    }, [initialTabs]);

    return (
        <Tabs
            type="editable-card"
            activeKey={activeKey}
            onChange={onChange}
            onEdit={(targetKey, action) => {
                if (action === "remove") handleRemove(targetKey as string);
            }}
            hideAdd
            items={items}
            className="bill-tabs"
            style={{ minHeight: '100%' }}
        />
    );
};

export default BillTabs;
