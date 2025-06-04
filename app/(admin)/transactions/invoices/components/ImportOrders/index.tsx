import React, { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col } from 'antd';
import ProductGridTemplate from '@/components/templates/ProductGridTemplate';
import ImportOrdersForm from './ImportOrdersForm';
import { useInvoiceTableData } from '@/hooks/useInvoiceTableData';
import { ITypeImportInvoice } from '@/types/invoice';
import { InvoiceStatus } from '@/enums/invoice';

const ImportOrders: React.FC<{ slug?: number, type?: ITypeImportInvoice }> = ({ slug, type }) => {
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [selectedProducts, setSelectedProducts] = useState<any>([]);
    const {
        tableData,
        invoiceDetails,
        invoiceSummary,
    } = useInvoiceTableData(slug ?? 0);

    useMemo(() => {
        if (type == 'copy ') {
            invoiceDetails.status = InvoiceStatus.DRAFT
        }
    }, [type, invoiceDetails])

    return (
        <Row gutter={16} style={{ height: "100%" }}>
            {/* Left side */}
            <Col span={16}>
                <ProductGridTemplate disableAction={invoiceDetails?.status === InvoiceStatus.RECEIVED} setTotalAmount={setTotalAmount} tableData={tableData} setData={setSelectedProducts} />
            </Col>

            {/* Right side */}
            <Col span={8}>
                <Card
                    title="Thông tin hoá đơn"
                    style={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                    styles={{
                        body: {
                            flex: 1,
                        },
                    }}
                >
                    <ImportOrdersForm subtotal={totalAmount} type={type} invoiceDetails={invoiceDetails} invoiceSummary={invoiceSummary} selectedProducts={selectedProducts} />
                </Card>
            </Col>
        </Row>
    );
};

export default ImportOrders;
