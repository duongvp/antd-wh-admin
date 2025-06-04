import React, { useState } from 'react';
import { Card, Row, Col } from 'antd';
import ProductGridTemplate from '@/components/templates/ProductGridTemplate';
import ImportGoodsForm from './ImportGoodsForm';
import { usePurchaseOrderTableData } from '@/hooks/usePurchaseOrderTableData';
import { ITypeImportInvoice } from '@/types/invoice';

interface IImportGoodsProps {
    slug?: number;
    type?: ITypeImportInvoice
}

const ImportGoods: React.FC<IImportGoodsProps> = ({ slug, type }) => {
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [selectedProducts, setSelectedProducts] = useState<any>([]);
    const {
        tableData,
        poInfos,
        poSummary,
        loading,
        error,
    } = usePurchaseOrderTableData(slug ?? 0);

    return (
        <Row gutter={16} style={{ height: "100%" }}>
            {/* Left side */}
            <Col span={16}>
                <ProductGridTemplate setTotalAmount={setTotalAmount} tableData={tableData} setData={setSelectedProducts} isViewPurchasePrice={true} />
            </Col>

            {/* Right side */}
            <Col span={8}>
                <Card
                    title="Thông tin phiếu nhập"
                    style={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                    styles={{
                        body: {
                            flex: 1,
                        },
                    }}
                >
                    <ImportGoodsForm subtotal={totalAmount} type={type} poInfos={poInfos} poSummary={poSummary} selectedProducts={selectedProducts} />
                </Card>
            </Col>
        </Row>
    );
};

export default ImportGoods;
