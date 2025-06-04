'use client';
import React from 'react';
import { Button, Modal } from 'antd';

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    content?: React.ReactNode;
    okText?: string;
    cancelText?: string;
    onOk?: () => void;
    onCancel?: () => void;
    loading?: boolean;
    props?: React.ComponentProps<typeof Modal>;
}

const ConfirmModal = ({
    open,
    title = 'Xác nhận',
    content,
    okText = 'Đồng ý',
    cancelText = 'Huỷ',
    onOk,
    onCancel,
    loading = false,
    props
}: ConfirmModalProps) => {
    return (
        <Modal
            open={open}
            title={title}
            onOk={onOk}
            onCancel={onCancel}
            okText={okText}
            cancelText={cancelText}
            confirmLoading={loading}
            centered
            destroyOnClose
            width={480}
            {...props}
            footer={[
                <Button
                    key="cancel"
                    onClick={onCancel}
                >
                    {cancelText}
                </Button>,
                <Button
                    key="ok"
                    onClick={onOk}
                    loading={loading}
                    color="red"
                    variant='solid'
                >
                    {okText}
                </Button>,
            ]}
        >
            {content}
        </Modal >
    );
};

export default ConfirmModal;
