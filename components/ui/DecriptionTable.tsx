import React from 'react';
import { Tabs, Table, Button, Space, Row, Col } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';

const onChange = (key: string) => {
    console.log(key);
};

// Dữ liệu và cột cho bảng
const tableData1 = [
    { key: '1', name: 'John', age: 32 },
    { key: '2', name: 'Jane', age: 28 },
];

const columns1 = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
];

const handleExport = () => {
    console.log('Export data');
    // Thêm logic xuất file (Excel, CSV, PDF...) ở đây
};

const handleImport = () => {
    // Thêm logic nhập file ở đây
};

// Component tùy chỉnh chứa Table và các nút action
const TableWithActions = () => {
    return (
        <div>
            <Table
                bordered={true} // Tắt viền bảng
                dataSource={tableData1}
                columns={columns1}
                pagination={false} // Tắt phân trang
            />
            <Row justify="end" align="middle" style={{ marginTop: 16 }}>
                <Col>
                    <Space>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                        >
                            Xuất file
                        </Button>
                        <Button
                            icon={<UploadOutlined />}
                            onClick={handleImport}
                        >
                            Nhập file
                        </Button>
                    </Space>
                </Col>

                {/* Có thể thêm các nút khác ở đây */}
            </Row>
        </div>
    );
};

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Tab 1',
        children: <TableWithActions />,
    },
    {
        key: '2',
        label: 'Tab 2',
        children: 'Nội dung tab 2',
    },
];

const DecriptionTable: React.FC = () => (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
);

export default DecriptionTable;