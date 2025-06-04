import React, { useState } from 'react';
import { Card, Row, Col } from 'antd';
import ImportInventoriesForm from './ImportInventoriesForm';
import InventoryCheckSelect from '@/components/templates/InventoryCheckTemplate';
import { useInventoryCheckTableData } from '@/hooks/useInventoryCheckTableData';
import ProductModal from '@/app/(admin)/products/components/Modal/ProductModal';
import { ITypeImportInvoice } from '@/types/invoice';

interface IImportInventoriesProps {
    slug?: number;
    type?: ITypeImportInvoice;
}

const ImportInventories: React.FC<IImportInventoriesProps> = ({ slug, type }) => {
    const [totalActualQuantity, setTotalActualQuantity] = useState<number>(0);
    const [data, setData] = useState<any>({});

    const {
        tableData,
        inventoryDetails,
        inventorySummary,
        loading,
        error,
    } = useInventoryCheckTableData(slug ?? 0);

    return (
        <Row gutter={16} style={{ height: "100%" }}>
            {/* Left side */}
            <Col span={16}>
                <InventoryCheckSelect setTotalActualQuantity={setTotalActualQuantity} tableData={tableData} setData={setData} />
            </Col>

            {/* Right side */}
            <Col span={8}>
                <Card
                    title="Thông tin kiểm kho"
                    style={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                    styles={{
                        body: {
                            flex: 1,
                        },
                    }}
                >
                    <ImportInventoriesForm totalActualQuantity={totalActualQuantity} data={data} type={type} slug={slug} />
                </Card>
            </Col>
        </Row>
    );
};

export default ImportInventories;
