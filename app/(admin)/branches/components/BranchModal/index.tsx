'use client';
import { Modal, Form, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import CustomSpin from '@/components/ui/Spins';
import { showErrorMessage, showSuccessMessage } from '@/ultils/message';
import AreaWardSelector from '@/components/templates/AreaWardSelector';
import useBranchStore from '@/stores/branchStore';
import { ActionType } from '@/enums/action';
import { createWarehouse, updateWarehouse } from '@/services/branchService';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const BranchModal = () => {
    const [form] = Form.useForm();
    const { modal, resetModal, setShouldReload } = useBranchStore();
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);

    const onCloseModal = () => {
        form.resetFields();
        resetModal()
    }

    const handleFormSubmit = async (values: any) => {
        try {
            setLoadingModalVisible(true);
            // await createCategory(values);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            if (modal.type === ActionType.CREATE) {
                await createWarehouse(values);
            } else if (modal.type === ActionType.UPDATE) {
                await updateWarehouse(modal.warehouse?.warehouse_id || 0, values);
            }

            form.resetFields();
            onCloseModal();
            setShouldReload(true);
            showSuccessMessage(`${modal.title} thành công!`);
        } catch (error) {
            console.error('Lỗi submit:', error);
            showErrorMessage(`${modal.title} thất bại!`);
        } finally {
            setLoadingModalVisible(false);
        }
    };

    useEffect(() => {
        if (modal.open) {
            // form.setFieldsValue({ ...modal.user, role_id: 1 });
            form.setFieldsValue({
                ...modal.warehouse,
                // area: 'Thành phố Hà Nội - Quận Hoàn Kiếm',
                // ward: 'Phường Đồng Xuân',
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
                centered
                footer={[
                    <Button key="back" onClick={onCloseModal} icon={<CloseCircleOutlined />}>
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
                    onFinish={handleFormSubmit}
                    {...formItemLayout}
                    labelAlign="left"
                >
                    <Form.Item label="Tên chi nhánh" name="warehouse_name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Điện thoại" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                        <Input />
                    </Form.Item>
                    <AreaWardSelector form={form} />
                </Form>
            </Modal>
        </>
    );
};

export default BranchModal;
