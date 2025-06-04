'use client';
import { Modal, Form, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import CustomSpin from '@/components/ui/Spins';
import { showErrorMessage, showSuccessMessage } from '@/ultils/message';
import AreaWardSelector from '@/components/templates/AreaWardSelector';
import useSupplierStore from "@/stores/supplierStore";

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const SupplierModal = () => {
    const [form] = Form.useForm();
    const { modal, resetModal } = useSupplierStore();
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);

    const onCloseModal = () => {
        form.resetFields();
        resetModal()
    }

    const handleFormSubmit = async (values: any) => {
        console.log("🚀 ~ handleFormSubmit ~ values:", values)
        try {
            setLoadingModalVisible(true);
            // await createCategory(values);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            form.resetFields();
            onCloseModal();
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
            form.setFieldsValue({
                ...modal.suppliers,
                area: 'Thành phố Hà Nội - Quận Hoàn Kiếm',
                ward: 'Phường Đồng Xuân',
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
                        onClick={() => form.submit()}
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
                    <Form.Item label="Mã nhà cung cấp" name="supplier_code">
                        <Input placeholder="Mã mặc định" />
                    </Form.Item>
                    <Form.Item label="Tên nhà cung cấp" name="supplier_name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Điện thoại" name="phone">
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

export default SupplierModal;
