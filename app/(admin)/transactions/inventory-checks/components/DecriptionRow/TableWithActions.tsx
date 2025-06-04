import React from 'react';
import { Row, Col, Typography, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleFilled, CopyFilled, CopyOutlined, DownloadOutlined, FolderOpenFilled, SaveFilled } from '@ant-design/icons';
import CustomTable from '@/components/ui/Table';
import dayjs from 'dayjs';
import { getInventoryCheckStatusLabel, Status } from '@/enums/status';
import ConfirmButton from '@/components/ui/ConfirmButton';
import ActionButton from '@/components/ui/ActionButton';
import { useRouter } from 'next/navigation';
import { deleteInventoryCheck, InventoryCheckBase, StockTakeSummary } from '@/services/inventoryCheckService';
import useInventoryCheckStore from '@/stores/inventoryCheckStore';

const { Text } = Typography;

interface TableWithActionsProps {
    tableData: any[];
    inventoryCheckDetails: Partial<InventoryCheckBase>;
    inventoryCheckSummary: Partial<StockTakeSummary>
}

const TableWithActions: React.FC<TableWithActionsProps> = ({ tableData, inventoryCheckDetails, inventoryCheckSummary }) => {
    const router = useRouter();
    const { setShouldReload } = useInventoryCheckStore()

    const columns = [
        { title: 'Mã hàng', dataIndex: 'product_code', key: 'product_code' },
        { title: 'Tên hàng', dataIndex: 'product_name', key: 'product_name' },
        { title: 'Tồn kho', dataIndex: 'system_quantity', key: 'system_quantity' },
        { title: 'Thực tế', dataIndex: 'actual_quantity', key: 'actual_quantity' },
        { title: 'SL lệch', dataIndex: 'variance', key: 'variance' },
        { title: 'Giá trị lệch', dataIndex: 'value_variance', key: 'value_variance', render: (value: string) => Number(value).toLocaleString() },
    ];

    const handleConfirmDelete = async () => {
        await deleteInventoryCheck(inventoryCheckDetails.stock_take_id || 0);
        setShouldReload(true);
    }

    return (
        <div>
            <Row gutter={24} style={{ marginBottom: 12 }}>
                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Mã kiểm kho:</Text></Col>
                        <Col><Text>{inventoryCheckDetails.stock_take_code}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Thời gian:</Text></Col>
                        <Col><Text>{dayjs(inventoryCheckDetails.created_at).format('DD/MM/YYYY HH:mm')}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Người tạo:</Text></Col>
                        <Col><Text>{inventoryCheckDetails.created_by}</Text></Col>
                    </Row>
                </Col>

                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Trạng thái:</Text></Col>
                        <Col><Text>{getInventoryCheckStatusLabel(inventoryCheckDetails.status as Status)}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Chi nhánh:</Text></Col>
                        <Col><Text>{inventoryCheckDetails.warehouse_name}</Text></Col>
                    </Row>
                </Col>
                <Col span={8} style={{ height: '100%' }}>
                    <Text type="secondary" italic>Ghi chú...</Text>
                </Col>
            </Row>

            <CustomTable
                bordered={true}
                dataSource={tableData}
                columns={columns}
                pagination={false}
                size='small'
            />

            <Row gutter={24} justify={"end"} align={"top"} style={{ marginTop: 12 }}>
                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng số mặt hàng</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{inventoryCheckSummary?.total_items}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng chênh lệch</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{inventoryCheckSummary?.total_variance}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Giá trị lệch</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{inventoryCheckSummary?.total_value_variance?.toLocaleString()}</Text></Col>
                    </Row>
                </Col>
            </Row>

            <Row justify="end" align="middle" style={{ marginTop: 16 }}>
                <Col>
                    <Space>
                        {
                            inventoryCheckDetails.status === Status.DRAFT && (
                                <ActionButton
                                    type='primary'
                                    label='Cập nhật'
                                    color='green'
                                    variant='solid'
                                    icon={<CheckCircleOutlined />}
                                    onClick={() => {
                                        router.push(`/transactions/inventory-checks/edit/${inventoryCheckDetails.stock_take_id}`)
                                    }}
                                />
                            )
                        }
                        <ActionButton
                            type='primary'
                            label='Xuất file'
                            color='orange'
                            variant='solid'
                            icon={<DownloadOutlined />}
                        />
                        {
                            inventoryCheckDetails.status === Status.DRAFT && (
                                <ConfirmButton
                                    label="Xoá"
                                    customColor="red"
                                    icon={<CloseCircleFilled />}
                                    onConfirm={handleConfirmDelete}
                                    confirmMessage={`Bạn có chắc chắn muốn xoá phiếu kiểm kho ${inventoryCheckDetails.stock_take_code}?`}
                                    messageWhenSuccess="Xoá phiếu thành công"
                                    messageWhenError="Có lỗi xảy ra khi xoá phiếu"
                                />
                            )
                        }
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default TableWithActions;