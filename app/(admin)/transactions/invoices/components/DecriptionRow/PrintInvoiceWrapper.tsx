'use client';

import React, { useRef, useState } from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { PrinterFilled } from '@ant-design/icons';
import InvoiceToPrint from '@/components/shared/InvoiceToPrint';
import { IInvoiceDetail, IInvoiceTableData } from '@/types/invoice';

interface PrintWrapperProps {
    data: Partial<IInvoiceTableData>[];
    invoiceDetails: Partial<IInvoiceDetail>;
    invoiceSummary: any;
}

const PrintInvoiceWrapper: React.FC<PrintWrapperProps> = ({
    data,
    invoiceDetails,
    invoiceSummary,
}) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [printMode, setPrintMode] = useState<'full' | 'simple'>('full');

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
    });

    const items: MenuProps['items'] = [
        {
            key: 'full',
            label: 'Mẫu đầy đủ',
            onClick: () => {
                setPrintMode('full');
                setTimeout(() => handlePrint(), 100); // Delay nhỏ để đảm bảo state được cập nhật
            }
        },
        {
            key: 'simple',
            label: 'Mẫu đơn giản',
            onClick: () => {
                setPrintMode('simple');
                setTimeout(() => handlePrint(), 100);
            }
        }
    ];

    return (
        <div>
            <Dropdown menu={{ items }} placement="bottomRight">
                <Button type="primary" variant='solid' color='orange' icon={<PrinterFilled />}>
                    In
                </Button>
            </Dropdown>

            <div style={{ display: 'none' }}>
                <div ref={componentRef}>
                    <InvoiceToPrint
                        data={data}
                        invoiceDetails={invoiceDetails}
                        invoiceSummary={invoiceSummary}
                        printMode={printMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default PrintInvoiceWrapper;