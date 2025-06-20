'use client';
import { Modal, Form, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import CustomSpin from '@/components/ui/Spins';
import { showErrorMessage, showSuccessMessage } from '@/ultils/message';
import useCustomerStore from '@/stores/customerStore';
import { createCustomer, updateCustomer } from '@/services/customerService';
import { ActionType } from '@/enums/action';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const CustomerModal = () => {
    const [form] = Form.useForm();
    const { modal, resetModal, setShouldReload } = useCustomerStore();
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);

    const onCloseModal = () => {
        form.resetFields();
        resetModal()
    }

    const handleFormSubmit = async () => {
        try {
            const rawValues = form.getFieldsValue();
            const values = Object.fromEntries(
                Object.entries(rawValues).map(([key, value]) => {
                    if (typeof value === 'string') {
                        return [key, value.trim()];
                    }
                    return [key, value];
                })
            );

            setLoadingModalVisible(true);

            if (modal.type === ActionType.CREATE) {
                await createCustomer(values);
            } else if (modal.type === ActionType.UPDATE) {
                await updateCustomer(modal.customer?.customer_id || 0, values);
            }

            form.resetFields();
            setShouldReload(true);
            onCloseModal();
            showSuccessMessage(`${modal.title} thành công!`);
        } catch (error: Error | any) {
            error.message ? showErrorMessage(error.message) : showErrorMessage(`${modal.title} thất bại!`);
        } finally {
            setLoadingModalVisible(false);
        }
    };


    useEffect(() => {
        if (modal.open) {
            form.setFieldsValue({
                ...modal.customer,
            });
        }
    }, [modal.open]);

    return (
        <>
            <CustomSpin openSpin={loadingModalVisible} />
            <Modal
                title={modal.title}
                open={modal.open}
                onCancel={onCloseModal}
                width={600}
                footer={[
                    <Button key="back" onClick={onCloseModal} icon={<CloseCircleOutlined />}>
                        Huỷ
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleFormSubmit}
                        icon={<SaveOutlined />}
                    >
                        Lưu
                    </Button>,
                ]}
                destroyOnClose
            >
                <Form
                    form={form}
                    onFinish={handleFormSubmit}
                    {...formItemLayout}
                    labelAlign="left"
                >
                    <Form.Item label="Mã khách hàng" name="customer_code">
                        <Input placeholder="Mã mặc định" />
                    </Form.Item>
                    <Form.Item label="Tên khách hàng" name="customer_name" rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Điện thoại" name="phone" rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại khách hàng!' },
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.resolve();

                                // Nếu thiếu số 0 đầu, tự thêm vào để kiểm tra định dạng
                                const normalized = value.startsWith('0') ? value : '0' + value;

                                const vietnamPhoneRegex = /^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

                                if (vietnamPhoneRegex.test(normalized)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject('Số điện thoại không hợp lệ!');
                                }
                            },
                        },
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CustomerModal;
