import React, { useState } from 'react';
import { Card, Row, Col } from 'antd';
import ProductGridTemplate from '@/components/templates/ProductGridTemplate';
import { useInvoiceTableData } from '@/hooks/useInvoiceTableData';
import { ITypeImportInvoice } from '@/types/invoice';
import ReturnOrdersForm from './ReturnOrdersForm';

const ReturnOrders: React.FC<{ slug?: number, type?: ITypeImportInvoice }> = ({ slug, type }) => {
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [data, setData] = useState<any>([]);
    const {
        tableData,
        invoiceDetails,
        invoiceSummary,
    } = useInvoiceTableData(slug ?? 0);

    return (
        <Row gutter={16} style={{ height: "100%" }}>
            {/* Left side */}
            <Col span={16}>
                <ProductGridTemplate setTotalAmount={setTotalAmount} tableData={tableData} setData={setData} />
            </Col>

            {/* Right side */}
            <Col span={8}>
                <Card
                    title={`Thông tin hoá đơn ${invoiceDetails?.invoice_code} (trả hàng)`}
                    style={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                    styles={{
                        body: {
                            flex: 1,
                        },
                    }}
                >
                    <ReturnOrdersForm totalAmount={totalAmount} type={type} invoiceDetails={invoiceDetails} invoiceSummary={invoiceSummary} data={data} />
                </Card>
            </Col>
        </Row>
    );
};

export default ReturnOrders;
