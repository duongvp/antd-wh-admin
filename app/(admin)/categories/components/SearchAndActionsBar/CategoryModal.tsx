'use client';
import { Modal, Form, Flex, Input, Button } from 'antd';
import React, { useEffect } from 'react';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import CustomSpin from '@/components/ui/Spins';
import { showErrorMessage, showSuccessMessage } from '@/ultils/message';
import { createCategory, updateCategory } from '@/services/categoryService';
import useCategoryStore from '@/stores/categoryStore';
import { ActionType } from '@/enums/action';

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const CategoryModal = () => {
    const [form] = Form.useForm();
    const [loadingModalVisible, setLoadingModalVisible] = React.useState(false); // <- loading Modal riêng biệt
    const { modal, resetModal, setShouldReload } = useCategoryStore();
    const onCloseModal = () => {
        form.resetFields();
        resetModal()
    }

    const handleFormSubmit = async (values: any) => {
        try {
            setLoadingModalVisible(true);
            if (modal.type === ActionType.CREATE) {
                await createCategory(values); // Gọi API tạo nhóm hàng
            } else if (modal.type === ActionType.UPDATE) {
                // Gọi API cập nhật nhóm hàng
                await updateCategory(modal.category?.category_id || 0, values);
            }
            setShouldReload(true);
            showSuccessMessage(`${modal.title} thành công!`);
        } catch (error) {
            console.error('Lỗi submit:', error);
            showErrorMessage(`${modal.title} thất bại!`);
        } finally {
            setLoadingModalVisible(false);
            onCloseModal();
        }
    };

    useEffect(() => {
        if (modal.open) {
            form.setFieldsValue({
                ...modal.category,
            });
        }
    }, [modal.open]);

    return (
        <>
            {/* Modal Loading Riêng */}
            <CustomSpin openSpin={loadingModalVisible} />
            <Modal
                title={modal.title}
                open={modal.open}
                onCancel={onCloseModal}
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
                >
                    <Flex style={{ flexDirection: 'column' }}>
                        <Form.Item {...formItemLayout} label="Tên nhóm" name="category_name" rules={[{ required: true, message: 'Vui lòng nhập tên nhóm' }]}>
                            <Input placeholder="Tên nhóm" />
                        </Form.Item>
                    </Flex>
                </Form>
            </Modal>
        </>
    );
};

export default CategoryModal;
