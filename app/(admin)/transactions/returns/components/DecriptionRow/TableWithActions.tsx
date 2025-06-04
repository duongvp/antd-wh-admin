import React from 'react';
import { Row, Col, Typography, Space, Button } from 'antd';
import { CloseCircleFilled, CopyOutlined, DeleteOutlined, DownloadOutlined, FolderOpenFilled, FolderOpenOutlined, SaveFilled, SaveOutlined } from '@ant-design/icons';
import CustomTable from '@/components/ui/Table';
import dayjs from 'dayjs';
import { getReturnOrderStatusLabel, Status } from '@/enums/status';
import Link from 'next/link';
import ConfirmButton from '@/components/ui/ConfirmButton';
import ActionButton from '@/components/ui/ActionButton';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

// interface TableWithActionsProps {
//     data: any[];
//     returnOrderDetails: {
//         returnOrderId: number;
//         time: string;
//         created_by: string;
//         branch: string;
//         status: Status;
//     };
//     returnOrderSummary: {
//         total_items: number;
//         total_variance: number;
//         total_value_variance: number;
//     };
// }

const TableWithActions: React.FC<any> = ({ data, returnOrderDetails, returnOrderSummary }) => {
    console.log("🚀 ~ data:", data)
    console.log("🚀 ~ returnOrderDetails:", returnOrderDetails)
    const router = useRouter();

    const columns = [
        { title: 'Mã hàng', dataIndex: 'product_code', key: 'product_code' },
        { title: 'Tên hàng', dataIndex: 'product_name', key: 'product_name' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Giá bán', dataIndex: 'unit_price', key: 'unit_price', render: (value: string) => Number(value).toLocaleString() },
        { title: 'Giá nhập lại', dataIndex: 'unit_price', key: 'unit_price', render: (value: string) => Number(value).toLocaleString() },
        {
            title: 'Thành tiền',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (value: string) => Number(value).toLocaleString(),
        },
    ];

    const handleCopyClick = () => {
        console.log('cap nhật');
    }

    return (
        <div>
            <Row gutter={24} style={{ marginBottom: 12 }}>
                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Mã trả hàng:</Text></Col>
                        <Col><Text>{returnOrderDetails.return_code}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Thời gian:</Text></Col>
                        <Col><Text>{dayjs(returnOrderDetails.created_at).format('DD/MM/YYYY HH:mm')}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Người tạo:</Text></Col>
                        <Col><Text>{returnOrderDetails.created_by}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Mã hoá đơn:</Text></Col>
                        <Col><Link href="#">{returnOrderDetails.invoice_code}</Link></Col>
                    </Row>
                </Col>

                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Trạng thái:</Text></Col>
                        <Col><Text>{getReturnOrderStatusLabel(returnOrderDetails.status)}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Chi nhánh:</Text></Col>
                        <Col><Text>{returnOrderDetails.warehouse_name}</Text></Col>
                    </Row>
                </Col>

                <Col span={8}>
                    <Text type="secondary" italic>Ghi chú...</Text>
                </Col>
            </Row>

            <CustomTable
                bordered={true}
                dataSource={data}
                columns={columns}
                pagination={false}
                size='small'
            />

            <Row gutter={24} justify={"end"} align={"top"} style={{ marginTop: 12 }}>
                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng số lượng</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{returnOrderSummary?.total_quantity}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng số mặt hàng</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{returnOrderSummary?.total_items}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng tiền hàng trả</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(returnOrderSummary?.total_amount)?.toLocaleString()}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Khách đã trả</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(returnOrderSummary?.amount_paid)?.toLocaleString()}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Phí trả hàng </Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(returnOrderSummary?.return_fee)?.toLocaleString()}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Cần trả khách</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}>{Number(returnOrderSummary?.refund_amount)?.toLocaleString()}</Col>
                    </Row>
                </Col>
            </Row>


            <Row justify="end" align="middle" style={{ marginTop: 16 }}>
                <Col>
                    <Space>
                        {
                            returnOrderDetails.status === Status.DRAFT && (
                                <ActionButton
                                    type='primary'
                                    label='Cập nhật'
                                    color='green'
                                    variant='solid'
                                    icon={<FolderOpenFilled />}
                                    onClick={() => {
                                        router.push(`/transactions/`)
                                    }}
                                />
                            )
                        }
                        <ActionButton
                            type='primary'
                            label='Sao chép'
                            color='green'
                            variant='solid'
                            icon={<CopyOutlined />}
                            onClick={() => {
                                router.push(`/transactions/`)
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
                            onConfirm={() => {
                                console.log("Hủy bỏ đã được xác nhận");
                            }}
                            confirmMessage="Bạn có chắc chắn muốn huỷ thao tác này?"
                            messageWhenSuccess="Huỷ phiếu thành công"
                            messageWhenError="Có lỗi xảy ra khi huỷ phiếu"
                        />

                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default TableWithActions;
