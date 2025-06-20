'use client';
import React from 'react';
import { Button, Space, Spin, Upload, message, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload';
import { useAuthStore } from '@/stores/authStore';
import * as XLSX from 'xlsx';
import { isEmpty } from 'lodash';

interface ImportButtonProps {
    importApiFn: (formData: FormData) => Promise<any>;
    onFileImport?: (data: any[]) => void;
    label?: string;
    onCloseImportModal?: () => void;
    setShouldReload: (value: boolean) => void;
    conditionImport?: Record<string, any>;
}

export default function ImportButton({
    importApiFn,
    onFileImport,
    label = 'Chọn file dữ liệu',
    onCloseImportModal,
    setShouldReload,
    conditionImport
}: ImportButtonProps) {
    const [api, contextHolder] = notification.useNotification();
    const { userId, warehouseId } = useAuthStore((state) => state.user);

    const handleBeforeUpload = async (file: File) => {
        if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
            message.error('Chỉ chấp nhận file Excel (.xlsx, .xls, .csv)');
            return Upload.LIST_IGNORE;
        }

        try {
            // Đọc nội dung file để kiểm tra số dòng
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            if (jsonData.length > 500) {
                message.warning(`File quá lớn, chỉ chấp nhận tối đa 500 dòng (file có ${jsonData.length} dòng)`);
                return Upload.LIST_IGNORE;
            }
        } catch (error) {
            message.error('Không thể đọc file. Vui lòng kiểm tra lại định dạng file.');
            return Upload.LIST_IGNORE;
        }

        if (onCloseImportModal) {
            onCloseImportModal();
        }

        const notificationKey = `import-${Date.now()}`;
        api.info({
            key: notificationKey,
            message: file.name,
            description: <Space><Spin size='small' />Đang xử lý import...</Space>,
            duration: 0,
            placement: 'bottomRight',
        });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const formData = new FormData();
            formData.append('file', file);
            formData.append('warehouse_id', String(warehouseId));
            formData.append('user_id', String(userId));
            !isEmpty(conditionImport) && formData.append('condition', JSON.stringify(conditionImport));

            const result = await importApiFn(formData);
            setShouldReload(true);

            if (result.data.errors?.length > 0) {
                const groupedErrors: Record<number, string[]> = {};
                result.data.errors.forEach((err: { row: number; error: string }) => {
                    if (!groupedErrors[err.row]) {
                        groupedErrors[err.row] = [];
                    }
                    groupedErrors[err.row].push(err.error);
                });

                const errorList = Object.entries(groupedErrors).map(([row, errors]) => (
                    <div key={row} className='text-red-500'>
                        {row && <span>Dòng {row}:</span>}
                        <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                            {errors.map((err, idx) => (
                                <li key={idx}>- {err}</li>
                            ))}
                        </ul>
                    </div>
                ));

                api.warning({
                    key: notificationKey,
                    message: file.name,
                    description: (
                        <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                            <p className="text-sm text-red-500">Import file lỗi</p>
                            {errorList}
                        </div>
                    ),
                    duration: 0,
                    placement: 'bottomRight',
                });
            } else {
                api.success({
                    key: notificationKey,
                    message: file.name,
                    description: (
                        <div className="flex flex-col">
                            <span className="text-emerald-700 text-sm">Import thành công</span>
                        </div>
                    ),
                    duration: 2.5,
                    placement: 'bottomRight',
                });
            }

            if (result.data.errors?.length > 0) {
                message.warning(`Có ${result.data.errors.length} lỗi`);
            }

            if (onFileImport) {
                onFileImport(result.data);
            }
        } catch (error: any) {
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
                    style={{ marginTop: 16, backgroundColor: '#52C41A' }}
                    icon={<DownloadOutlined />}
                >
                    {label}
                </Button>
            </Upload>
        </>
    );
}
