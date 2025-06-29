'use client';
import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { DownloadOutlined, PrinterFilled } from '@ant-design/icons';
import ActionButton from '@/components/ui/ActionButton';
import { IPurchaseOrderBase, IPurchaseOrderDetail, IPurchaseOrderSummary } from '@/services/purchaseOrderService';
import ViewToPrint from './ViewToPrint';
import { Space } from 'antd';
import { toPng } from 'html-to-image';
import { showErrorMessage } from '@/ultils/message';

interface PrintWrapperProps {
    data: Partial<IPurchaseOrderDetail>[];
    details: Partial<IPurchaseOrderBase>;
    summary: Partial<IPurchaseOrderSummary>;
}

const PrintPurchaseWrapper: React.FC<PrintWrapperProps> = ({
    data,
    details,
    summary,
}) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
    });

    const downloadAsImage = async () => {
        if (!componentRef.current) return;
        setIsDownloading(true); // bật A4
        await new Promise(resolve => setTimeout(resolve, 100)); // đợi DOM update

        try {
            const dataUrl = await toPng(componentRef.current, {
                cacheBust: true,
                pixelRatio: 2, // tăng độ nét mà không làm to
            });

            const link = document.createElement('a');
            link.download = `phieu-nhap.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Lỗi khi xuất ảnh:', err);
            showErrorMessage('Không thể xuất phiếu nhập thành ảnh!');
        } finally {
            setIsDownloading(false); // về lại khổ in
        }
    };

    return (
        <div>
            <Space>
                <ActionButton
                    type='primary'
                    label='In'
                    color='orange'
                    variant='solid'
                    onClick={handlePrint}
                    icon={<PrinterFilled />}
                />
                <ActionButton
                    type='primary'
                    label='Tải ảnh'
                    color='orange'
                    variant='solid'
                    icon={<DownloadOutlined />}
                    onClick={downloadAsImage}
                />
            </Space>

            {/* Nội dung in và xuất ảnh */}
            <div style={{ position: 'absolute', top: -9999, left: -9999 }}>
                <div ref={componentRef}>
                    <ViewToPrint
                        sizePrint={isDownloading ? '559px' : '300px'}
                        data={data}
                        details={details}
                        summary={summary}
                    />
                </div>
            </div>
        </div>
    );
};

export default PrintPurchaseWrapper;