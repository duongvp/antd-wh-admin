import React from 'react';
import { Row, Col, Typography, Space, } from 'antd';
import { CheckCircleFilled, CheckCircleOutlined, CloseCircleFilled, CopyOutlined, DownloadOutlined, FolderOpenFilled, SaveFilled } from '@ant-design/icons';
import CustomTable from '@/components/ui/Table';
import { getPOStatusLabel, POStatus } from '@/enums/purchaseOrder';
import ActionButton from '@/components/ui/ActionButton';
import { useRouter } from 'next/navigation';
import ConfirmButton from '@/components/ui/ConfirmButton';
import { showSuccessMessage } from '@/ultils/message';
import { IPurchaseOrderBase, IPurchaseOrderDetail, IPurchaseOrderSummary, updatePurchaseOrder } from '@/services/purchaseOrderService';
import dayjs from 'dayjs';
import usePurchaseOrderStore from '@/stores/purchaseOrderStore';

const { Text, Link } = Typography;

// Sửa lại prop nhận vào cho TableWithActions
interface TableWithActionsProps {
    poDetail: Partial<IPurchaseOrderDetail>[]; // Dữ liệu bảng
    poInfos: Partial<IPurchaseOrderBase>;
    poSummary: Partial<IPurchaseOrderSummary>
}

const TableWithActions: React.FC<TableWithActionsProps> = ({ poDetail, poInfos, poSummary }) => {
    const router = useRouter();
    const setShouldReload = usePurchaseOrderStore(state => state.setShouldReload);

    const columns = [
        { title: 'Mã hàng', dataIndex: 'product_code', key: 'product_code' },
        { title: 'Tên hàng', dataIndex: 'product_name', key: 'product_name' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Đơn giá', dataIndex: 'unit_price', key: 'unit_price', render: (value: any) => { return <span>{Number(value).toLocaleString()}</span> } },
        { title: 'Giảm giá', dataIndex: 'discount', key: 'discount', render: (value: any) => { return <span>{Number(value).toLocaleString()}</span> } },
        { title: 'Giá nhập', dataIndex: 'importPrice', key: 'importPrice', render: (value: any) => { return <span>{Number(value).toLocaleString()}</span> } },
        { title: 'Thành tiền', dataIndex: 'total_price', key: 'total_price', render: (value: any) => { return <span>{Number(value).toLocaleString()}</span> } },
    ];

    const handleConfirmOk = async () => {
        await updatePurchaseOrder(poInfos.po_id ?? 0, { status: POStatus.CANCELLED });
        setShouldReload(true);
    }

    return (
        <div>
            <Row gutter={24} style={{ marginBottom: 12 }}>
                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Mã nhập hàng:</Text></Col>
                        <Col><Text>{poInfos.po_code}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Thời gian:</Text></Col>
                        <Col><Text>{dayjs(poInfos.order_date).format('DD/MM/YYYY HH:mm')}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Nhà cung cấp:</Text></Col>
                        <Col><Link href="#">{poInfos.supplier_name}</Link></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Người tạo:</Text></Col>
                        <Col><Text>{poInfos.created_by}</Text></Col>
                    </Row>
                </Col>

                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Trạng thái:</Text></Col>
                        <Col><Text>{getPOStatusLabel(poInfos.status as POStatus)}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Chi nhánh:</Text></Col>
                        <Col><Text>{poInfos.warehouse_name}</Text></Col>
                    </Row>
                </Col>
                <Col span={8} style={{ height: '100%' }}>
                    <Text type="secondary" italic>Ghi chú...</Text>
                </Col>
            </Row>

            <CustomTable
                bordered={true}
                dataSource={poDetail}
                columns={columns}
                pagination={false}
                size='small'
            />

            <Row gutter={24} justify={"end"} align={"top"} style={{ marginTop: 12 }}>
                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng số lượng</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{poSummary?.total_quantity}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng số mặt hàng</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{poSummary?.total_items}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng tiền hàng</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(poSummary?.subtotal)?.toLocaleString()}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Giảm giá</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(poSummary?.discount_amount)?.toLocaleString()}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Cần trả NCC</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}>{Number(poSummary?.total_amount)?.toLocaleString()}</Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tiền đã trả NCC</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(poSummary?.amount_paid)?.toLocaleString()}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Còn nợ NCC</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(poSummary?.debt_amount)?.toLocaleString()}</Text></Col>
                    </Row>
                </Col>
            </Row>

            <Row justify="end" align="middle" style={{ marginTop: 16 }}>
                <Col>
                    <Space>
                        {
                            poInfos.status !== POStatus.CANCELLED && (
                                <>
                                    <ActionButton
                                        type='primary'
                                        label='Cập nhật'
                                        color='green'
                                        variant='solid'
                                        icon={<CheckCircleFilled />}
                                        onClick={() => {
                                            router.push(`/transactions/purchase-orders/edit/${poInfos.po_id}`)
                                        }}
                                    />
                                    <ActionButton
                                        type='primary'
                                        label='Sao chép'
                                        color='green'
                                        variant='solid'
                                        icon={<CopyOutlined />}
                                        onClick={() => {
                                            router.push(`/transactions/purchase-orders/copy-purchase-order/${poInfos.po_id}`)
                                        }}
                                    />
                                    <ActionButton
                                        type='primary'
                                        label='Xuất file'
                                        color='orange'
                                        variant='solid'
                                        icon={<DownloadOutlined />}
                                    />
                                    <ConfirmButton
                                        label="Huỷ bỏ"
                                        customColor="red"
                                        icon={<CloseCircleFilled />}
                                        onConfirm={handleConfirmOk}
                                        confirmMessage={`Bạn có chắc chắn muốn huỷ phiếu ${poInfos.po_code}? Hành động này sẽ không thể hoàn tác.`}
                                        messageWhenSuccess="Huỷ phiếu thành công"
                                        messageWhenError="Có lỗi xảy ra khi huỷ phiếu"
                                    />
                                </>
                            )
                        }
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default TableWithActions;
