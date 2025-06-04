'use client';
import { Modal, Form, Flex, Input, Select, Button, Spin } from 'antd';
import React from 'react';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';

interface TrademarkModalProps {
    open: boolean;
    onClose: () => void;
}

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const TrademarkModal = ({ open, onClose }: TrademarkModalProps) => {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Thêm thương hiệu"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} icon={<CloseCircleOutlined />}>
                    Huỷ
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => form.submit()}
                    icon={<SaveOutlined />}
                >
                    Lưu
                </Button>,
            ]}
        >
            <Form
                form={form}
                onFinish={(values) => {
                    console.log('Dữ liệu submit:', values);
                    form.resetFields();
                    onClose();
                }}
            >
                <Flex style={{ flexDirection: 'column' }}>
                    <Form.Item label="Tên thương hiệu" name="trademark_name" rules={[{ required: true, message: 'Vui lòng nhập tên nhóm' }]}>
                        <Input placeholder="Tên thương hiệu" />
                    </Form.Item>
                </Flex>
            </Form>
        </Modal>
    );
};

export default TrademarkModal;