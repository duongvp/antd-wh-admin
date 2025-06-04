import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Space, Button, DatePicker, Empty } from 'antd';
import { CheckCircleFilled, CheckCircleOutlined, CloseCircleFilled, CopyOutlined, DownloadOutlined, RetweetOutlined, SaveFilled, SaveOutlined, ShareAltOutlined } from '@ant-design/icons';
import CustomTable from '@/components/ui/Table';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { IInvoiceDetail, IInvoiceTableData } from '@/types/invoice';
import { getInvoiceStatusLabel, InvoiceStatus } from '@/enums/invoice';
import PrintInvoiceWrapper from './PrintInvoiceWrapper';
import ConfirmButton from '@/components/ui/ConfirmButton';
import ActionButton from '@/components/ui/ActionButton';
import SelectWithButton from '@/components/ui/Selects/SelectWithButton';
import { updateInvoice } from '@/services/invoiceService';
const { Text, Link } = Typography;

// Sửa lại prop nhận vào cho TableWithActions
interface TableWithActionsProps {
    data: Partial<IInvoiceTableData>[]; // Dữ liệu bảng
    invoiceDetails: Partial<IInvoiceDetail>;
    invoiceSummary: any;
    options: { value: number; labelText: string; label: string }[]
}

const TableWithActions: React.FC<TableWithActionsProps> = ({ data, invoiceDetails, invoiceSummary, options }) => {
    const router = useRouter()
    const [userIdSelected, setUserIdSelected] = useState<number | undefined>();
    const [dateTime, setDateTime] = useState<dayjs.Dayjs | null | undefined>(dayjs());

    const columns: ColumnsType<Partial<IInvoiceTableData>> = [
        { title: 'Mã hàng', dataIndex: 'product_code', key: 'product_code' },
        { title: 'Tên hàng', dataIndex: 'product_name', key: 'product_name' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Đơn giá', dataIndex: 'unit_price', key: 'unit_price', render: (value: any) => { return <span>{Number(value).toLocaleString()}</span> } },
        { title: 'Giảm giá', dataIndex: 'discount', key: 'discount', render: (value: any) => { return <span>{Number(value).toLocaleString()}</span> } },
        // { title: 'Giá bán', dataIndex: 'selling_price', key: 'selling_price', render: (value: any) => { return <span>{Number(value).toLocaleString()}</span> } },
        { title: 'Thành tiền', dataIndex: 'total_price', key: 'total_price', render: (value: any) => { return <span>{Number(value).toLocaleString()}</span> } },
    ];

    const handleConfirmOk = async () => {
        await updateInvoice(invoiceDetails.invoice_id ?? 0, { status: InvoiceStatus.CANCELLED })
    };

    const handleCopyClick = () => {
        window.open(`/transactions/invoices/copy-invoice/${invoiceDetails.invoice_id}`, '_blank');
        // router.push(`/transactions/invoices/copy-invoice/${invoiceDetails.invoice_id}`);
    }

    const handleEditClick = () => {
        window.open(`/transactions/invoices/edit/${invoiceDetails.invoice_id}`, '_blank');
    }

    useEffect(() => {
        setUserIdSelected(invoiceDetails.user_id)
        setDateTime(dayjs(invoiceDetails.invoice_date))
    }, [invoiceDetails])

    return (
        <div>
            <Row gutter={24} style={{ marginBottom: 12 }}>
                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Mã hoá đơn:</Text></Col>
                        <Col><Text>{invoiceDetails?.invoice_code}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Thời gian:</Text></Col>
                        {/* <Col>
                            <DatePicker
                                showTime={{ format: 'HH:mm' }}
                                format="DD/MM/YYYY HH:mm"
                                value={dateTime}
                                onChange={(value) => setDateTime(value)}
                                allowClear={false}
                                size="small"
                                variant="outlined"
                            />
                        </Col> */}
                        <Col><Text>{dayjs(invoiceDetails.invoice_date).format('DD/MM/YYYY HH:mm')}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Khách hàng:</Text></Col>
                        <Col><Link href="#">{invoiceDetails.customer_name}</Link></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Người tạo:</Text></Col>
                        {/* <Col>
                            <SelectWithButton
                                options={options}
                                size='small'
                                placeholder="người tạo"
                                value={userIdSelected} // <-- dùng state
                                onChange={(value) => setUserIdSelected(Number(value))}
                                allowClear={false}
                                notFoundContent={
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Không có kết quả phù hợp"
                                    />
                                }
                            />
                        </Col> */}
                        <Col><Text>{invoiceDetails.created_by}</Text></Col>
                    </Row>
                </Col>

                <Col span={6}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Trạng thái:</Text></Col>
                        <Col><Text>{getInvoiceStatusLabel(invoiceDetails.status as InvoiceStatus)}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Chi nhánh:</Text></Col>
                        <Col><Text>{invoiceDetails.warehouse_name}</Text></Col>
                    </Row>
                </Col>
                <Col span={8} style={{ height: '100%' }}>
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
                        <Col span={16} style={{ textAlign: "end" }}><Text>{invoiceSummary?.total_quantity}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng số mặt hàng</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{invoiceSummary?.total_items}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng tiền hàng</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(invoiceSummary?.subtotal)?.toLocaleString()}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Giảm giá</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(invoiceSummary?.discount_amount)?.toLocaleString()}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Tổng cộng</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}>{Number(invoiceSummary?.total_amount)?.toLocaleString()}</Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Khách đã trả</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(invoiceSummary?.amount_paid)?.toLocaleString()}</Text></Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}><Text strong>Nợ</Text></Col>
                        <Col span={16} style={{ textAlign: "end" }}><Text>{Number(invoiceSummary?.debt_amount)?.toLocaleString()}</Text></Col>
                    </Row>
                </Col>
            </Row>

            <Row justify="end" align="middle" style={{ marginTop: 16 }}>
                <Col>
                    <Space>
                        {
                            invoiceDetails.status === InvoiceStatus.RECEIVED && (
                                <ActionButton
                                    type='primary'
                                    label='Trả hàng'
                                    color='green'
                                    variant='solid'
                                    icon={<CheckCircleOutlined />}
                                    onClick={() => {
                                        router.push(`/transactions/returns/create/${invoiceDetails.invoice_id}`);
                                    }}
                                />
                            )
                        }
                        {
                            invoiceDetails.status !== InvoiceStatus.CANCELLED && (
                                <>
                                    <ActionButton
                                        type='primary'
                                        label='Cập nhật'
                                        color='green'
                                        variant='solid'
                                        icon={<CheckCircleFilled />}
                                        onClick={handleEditClick}
                                    />
                                    <ActionButton
                                        type='primary'
                                        label='Sao chép'
                                        color='green'
                                        variant='solid'
                                        icon={<CopyOutlined />}
                                        onClick={handleCopyClick}
                                    />
                                </>
                            )
                        }
                        {
                            invoiceDetails.status === InvoiceStatus.RECEIVED && (
                                <>
                                    <PrintInvoiceWrapper data={data} invoiceDetails={invoiceDetails} invoiceSummary={invoiceSummary} />
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
                                            handleConfirmOk()
                                        }}
                                        confirmMessage="Bạn có chắc chắn muốn huỷ hoá đơn này? Hành động này sẽ không thể hoàn tác."
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
