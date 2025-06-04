import React from 'react';
import { Row, Col, Typography, Divider } from 'antd';
import dayjs from 'dayjs';
import { IInvoiceDetail, IInvoiceTableData } from '@/types/invoice';

const { Text, Title } = Typography;

// Sửa lại prop nhận vào cho InvoiceToPrint
interface TableWithActionsProps {
    data: Partial<IInvoiceTableData>[]; // Dữ liệu bảng
    invoiceDetails: Partial<IInvoiceDetail>;
    invoiceSummary: any;
    printMode?: 'full' | 'simple';
}

const InvoiceToPrint: React.FC<TableWithActionsProps> = ({ data, invoiceDetails, invoiceSummary, printMode }) => {
    const numberToWords = (num: number): string => {
        if (num === 0) return 'không đồng';

        const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi',
            'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
        const scales = ['', 'nghìn', 'triệu', 'tỷ'];

        const convertLessThanOneThousand = (n: number): string => {
            if (n === 0) return '';
            if (n < 10) return units[n];
            if (n < 20) return 'mười ' + (n % 10 !== 1 ? units[n % 10] : 'mốt');
            if (n < 100) {
                const ten = Math.floor(n / 10);
                const unit = n % 10;
                return tens[ten] + (unit !== 0 ? ' ' + (unit === 1 ? 'mốt' : units[unit]) : '');
            }

            const hundred = Math.floor(n / 100);
            const remainder = n % 100;
            return units[hundred] + ' trăm' + (remainder !== 0 ? ' ' + convertLessThanOneThousand(remainder) : '');
        };

        if (num < 0) return 'âm ' + numberToWords(Math.abs(num));

        let result = '';
        let scaleIndex = 0;

        while (num > 0) {
            const chunk = num % 1000;
            if (chunk !== 0) {
                let chunkStr = convertLessThanOneThousand(chunk);
                if (scaleIndex > 0) {
                    chunkStr += ' ' + scales[scaleIndex];
                }
                result = chunkStr + ' ' + result;
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
        }

        return result.trim() + ' đồng';
    };
    return (
        <div style={{ padding: 16, maxWidth: 400, margin: '0 auto' }}>
            <Title level={4} style={{ textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' }}>
                {invoiceDetails.warehouse_name}
            </Title>
            <Text style={{ display: 'block', textAlign: 'center', marginBottom: 8 }}>
                Địa chỉ: {invoiceDetails.warehouse_address}
            </Text>
            <Text style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}>
                Điện thoại:
            </Text>

            <Title level={3} style={{ textAlign: 'center', marginBottom: 16 }}>
                HÓA ĐƠN BÁN HÀNG
            </Title>

            <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Col>
                    <Text>Số HD: {invoiceDetails?.invoice_code}</Text>
                </Col>
                <Col>
                    <Text>Ngày: {dayjs(invoiceDetails.created_at).format('DD/MM/YYYY HH:mm:ss')}</Text>
                </Col>
            </Row>
            <div style={{ marginBottom: 16 }}>
                <Text strong>Khách hàng:</Text> {invoiceDetails.customer_name}
                <br />
                <Text strong>SDT:</Text> { }
                <br />
                <Text strong>Địa chỉ:</Text> { }
                <br />
                <Text strong>Người tạo:</Text> {invoiceDetails.created_by}
            </div>

            <Divider style={{ margin: '12px 0', borderTop: '1px dashed #000' }} />

            <table style={{ width: '100%', marginBottom: 16, borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', borderBottom: '1px dashed #000', padding: '4px 0' }}>Đơn giá</th>
                        <th style={{ textAlign: 'center', borderBottom: '1px dashed #000', padding: '4px 0' }}>SL</th>
                        <th style={{ textAlign: 'right', borderBottom: '1px dashed #000', padding: '4px 0' }}>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td colSpan={3} style={{ padding: '4px 0' }}>{item.product_name}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left', padding: '4px 0' }}>{Number(item.unit_price).toLocaleString()}</td>
                                <td style={{ textAlign: 'center', padding: '4px 0' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right', padding: '4px 0' }}>{(Number(item.unit_price) * (item.quantity ?? 0)).toLocaleString()}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <Divider style={{ margin: '12px 0', borderTop: '1px dashed #000' }} />
            {printMode === 'full' && (
                <div>
                    <Row justify="space-between" style={{ marginBottom: 8, paddingLeft: 130 }}>
                        <Col>
                            <Text strong>Tổng tiền hàng:</Text>
                        </Col>
                        <Col>
                            <Text strong>{invoiceSummary?.total_amount?.toLocaleString()}</Text>
                        </Col>
                    </Row>

                    <Row justify="space-between" style={{ marginBottom: 8, paddingLeft: 130 }}>
                        <Col>
                            <Text strong>Chiết khấu:</Text>
                        </Col>
                        <Col>
                            <Text strong>{invoiceSummary?.total_discount?.toLocaleString()}</Text>
                        </Col>
                    </Row>

                    <Row justify="space-between" style={{ marginBottom: 16, paddingLeft: 130 }}>
                        <Col>
                            <Text strong>Tổng thanh toán:</Text>
                        </Col>
                        <Col>
                            <Text strong>{invoiceSummary?.total_amount?.toLocaleString()}</Text>
                        </Col>
                    </Row>

                    {/* <Row justify="space-between" style={{ marginBottom: 16, paddingLeft: 130 }}>
                <Col>
                    <Text strong>Khách đã trả:</Text>
                </Col>
                <Col>
                    <Text strong>{invoiceSummary?.total_amount?.toLocaleString()}</Text>
                </Col>
            </Row>

            <Row justify="space-between" style={{ marginBottom: 16, paddingLeft: 130 }}>
                <Col>
                    <Text strong>Tiền thừa</Text>
                </Col>
                <Col>
                    <Text strong>{invoiceSummary?.total_amount?.toLocaleString()}</Text>
                </Col>
            </Row> */}

                    <Text style={{ fontStyle: 'italic', display: 'block', textAlign: 'right' }}>
                        ({numberToWords(invoiceSummary?.total_amount ?? 0)})
                    </Text>
                </div>
            )}
            <Text style={{ display: 'block', textAlign: 'center', marginTop: 24, fontStyle: 'italic' }}>
                Cảm ơn và hẹn gặp lại!
            </Text>
        </div>
    );
};

export default InvoiceToPrint;

