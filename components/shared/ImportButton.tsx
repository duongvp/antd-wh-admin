'use client';
import React from 'react';
import { Button, Space, Spin, Upload, message, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload';

interface ImportButtonProps {
    importApiFn: (formData: FormData) => Promise<any>;
    warehouseId?: string;
    userId?: string;
    onFileImport?: (data: any[]) => void;
    label?: string;
    onCloseImportModal?: () => void;
}

export default function ImportButton({
    importApiFn,
    warehouseId = '1',
    userId = '1',
    onFileImport,
    label = 'Chọn file dữ liệu',
    onCloseImportModal
}: ImportButtonProps) {
    const [api, contextHolder] = notification.useNotification();

    const handleBeforeUpload = async (file: File) => {
        if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
            message.error('Chỉ chấp nhận file Excel (.xlsx, .xls, .csv)');
            return Upload.LIST_IGNORE;
        }

        if (onCloseImportModal) {
            onCloseImportModal();
        }

        // Hiển thị notification loading với style giống ảnh
        const notificationKey = `import-${Date.now()}`;
        api.info({
            key: notificationKey,
            message: file.name, // Không hiển thị tiêu đề
            description: <Space><Spin size='small' />Đang xử lý import...</Space>,
            duration: 0, // Không tự động đóng
            placement: 'bottomRight',
        });

        try {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Giả lập thời gian xử lý
            const formData = new FormData();
            formData.append('file', file);
            formData.append('warehouse_id', warehouseId);
            formData.append('user_id', userId);

            const result = await importApiFn(formData);

            // Đóng notification loading và hiển thị thông báo thành công
            api.success({
                key: notificationKey,
                message: file.name,
                description: (
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Import thành công</span>
                        <div className="mt-1 text-sm">
                            <p>{result.data.created} mới - {result.data.updated} cập nhật - {result.data.skipped} bỏ qua</p>
                        </div>
                    </div>
                ),
                duration: 2.5,
                placement: 'bottomRight',
            });

            if (result.data.errors?.length > 0) {
                message.warning(`Có ${result.data.errors.length} lỗi`);
            }

            if (onFileImport) {
                onFileImport(result.data);
            }
        } catch (error: any) {
            // Đóng notification loading và hiển thị thông báo lỗi
            api.error({
                key: notificationKey,
                message: file.name,
                description: (
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Lỗi khi import</span>
                        <span className="mt-1 text-sm text-red-500">
                            {error.message || 'Đã xảy ra lỗi khi import file'}
                        </span>
                    </div>
                ),
                duration: 2.5,
                placement: 'bottomRight',
            });
        }

        return Upload.LIST_IGNORE;
    };

    const uploadProps: UploadProps = {
        beforeUpload: handleBeforeUpload,
        showUploadList: false,
        accept: '.xlsx,.xls,.csv',
    };

    return (
        <>
            {contextHolder}
            <Upload {...uploadProps}>
                <Button
                    type="primary"
                    style={{ marginTop: 16, backgroundColor: "#52C41A" }}
                    icon={<DownloadOutlined />}
                >
                    {label}
                </Button>
            </Upload>
        </>
    );
}