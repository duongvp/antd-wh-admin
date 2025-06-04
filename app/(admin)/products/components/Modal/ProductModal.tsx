'use client'; // Cần client component vì sử dụng interactivity
import { Modal, Input, Upload, InputNumber, Collapse, Row, Col, Form, Button, Space, CollapseProps } from 'antd';
import { CloseCircleOutlined, DeleteOutlined, PlusOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';
import SelectWithButton from '@/components/ui/Selects/SelectWithButton';
import CategoryModal from '@/app/(admin)/categories/components/SearchAndActionsBar/CategoryModal';
import TrademarkModal from '@/app/(admin)/trademarks/components/SearchAndActionsBar/TrademarkModal';
import { showErrorMessage, showSuccessMessage } from '@/ultils/message';
import CustomInput from '@/components/ui/Inputs';
import useProductStore from '@/stores/productStore';
import useCategoryStore from '@/stores/categoryStore';
import { ActionType } from '@/enums/action';
import { getCategories } from '@/services/categoryService';
import UnitModal from '@/app/(admin)/units/components/UnitModal';
import { getUnits } from '@/services/unitService';
import { createProduct, updateProduct } from '@/services/productService';
import { useAuthStore } from '@/stores/authStore';
import useUnitStore from '@/stores/unitStore';
import { Status } from '@/enums/status';
import { createInventoryCheck } from '@/services/inventoryCheckService';
import { isEmpty, set } from 'lodash';

interface SubUnit {
    id: string;
    name: string;
    conversionValue: number;
    price: number;
    sellDirectly: boolean;
}

// const UnitOfMeasureCollapse = () => {
//     const [subUnits, setSubUnits] = useState<SubUnit[]>([]);

//     const addSubUnit = () => {
//         setSubUnits((prev) => [
//             ...prev,
//             {
//                 id: Math.random().toString(36).substring(2, 9),
//                 name: "",
//                 conversionValue: 1,
//                 price: 0,
//                 sellDirectly: true,
//             },
//         ]);
//     };

//     const updateSubUnit = (id: string, key: keyof SubUnit, value: any) => {
//         setSubUnits((prev) =>
//             prev.map((item) =>
//                 item.id === id ? { ...item, [key]: value } : item
//             )
//         );
//     };

//     const removeSubUnit = (id: string) => {
//         setSubUnits((prev) => prev.filter((item) => item.id !== id));
//     };

//     const items: CollapseProps["items"] = [
//         {
//             key: "1",
//             label: "Đơn vị tính",
//             children: (
//                 <Space direction="vertical" style={{ width: "100%" }}>
//                     {/* Base Unit */}
//                     <Space
//                         style={{ display: "flex", justifyContent: "space-between", width: "100%" }}
//                         wrap
//                     >
//                         <CustomInput
//                             groupStyle={{ flexDirection: "column", alignItems: "flex-start" }}
//                             label="Đơn vị cơ bản"
//                             defaultValue=""
//                             style={{ width: 150 }}
//                         />
//                     </Space>

//                     {/* Sub Units */}
//                     {subUnits.map((unit) => (
//                         <Space
//                             key={unit.id}
//                             style={{ display: "flex", justifyContent: "space-between", width: "100%" }}
//                             align="center"
//                             wrap
//                         >
//                             <CustomInput
//                                 groupStyle={{ flexDirection: "column", alignItems: "flex-start" }}
//                                 label="Tên đơn vị"
//                                 value={unit.name}
//                                 onChange={(e) => updateSubUnit(unit.id, "name", e.target.value)}
//                                 style={{ width: 200 }}
//                             />
//                             <CustomInput
//                                 groupStyle={{ flexDirection: "column", alignItems: "flex-start" }}
//                                 label="Giá trị quy đổi"
//                                 value={unit.conversionValue}
//                                 onChange={(value) =>
//                                     updateSubUnit(unit.id, "conversionValue", value || 1)
//                                 }
//                                 style={{ width: 200, textAlign: "left" }}
//                                 isNumber
//                             />
//                             <CustomInput
//                                 groupStyle={{ flexDirection: "column", alignItems: "flex-start" }}
//                                 label="Giá trị quy đổi"
//                                 value={unit.price}
//                                 onChange={(value) => updateSubUnit(unit.id, "price", value || 0)}
//                                 isNumber
//                                 style={{ width: 200, textAlign: "left" }}
//                             />
//                             <Button
//                                 type="text"
//                                 icon={<DeleteOutlined />}
//                                 onClick={() => removeSubUnit(unit.id)}
//                             />
//                         </Space>
//                     ))}

//                     {/* Add Unit Button */}
//                     <Button icon={<PlusOutlined />} onClick={addSubUnit}>
//                         Thêm đơn vị
//                     </Button>
//                 </Space>
//             ),
//         },
//     ];

//     return <Collapse
//         items={items}
//         style={{ marginTop: 24 }}
//         size="small"
//         expandIconPosition="end"
//         bordered />;
// }

const ProductModal = () => {
    const { modal, resetModal, setShouldReload } = useProductStore();
    const {
        shouldReload: shouldReloadCategory,
        setShouldReload: setShouldReloadCategory,
        setModal: setModalCategory,
        optionsCategory,
        setOptionsCategory
    } = useCategoryStore();

    const {
        shouldReload: shouldReloadUnit,
        setShouldReload: setShouldReloadUnit,
        setModal: setModalUnit,
        optionsUnit,
        setOptionsUnit
    } = useUnitStore();

    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);
    const { warehouseId, userId } = useAuthStore(state => state.user);
    const [loading, setLoading] = React.useState(false);
    const [prevStock, setPrevStock] = React.useState(0);

    const onClose = () => {
        form.resetFields();
        resetModal();
    };

    const uploadButton = (
        <div style={{
            border: '1px dashed #d9d9d9',
            padding: 10,
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            background: '#fafafa'
        }}>
            <UploadOutlined />
        </div>
    );

    const handleFinish = async (values: any) => {
        if (warehouseId === -1) return
        try {
            setLoading(true);
            // await createCategory(values);
            console.log("🚀 ~ handleFinish ~ values:", values);
            const data = {
                ...values,
                warehouse_id: warehouseId
            }

            if (modal.type === ActionType.CREATE || modal.type === ActionType.COPY) {
                await createProduct(data);
            } else if (modal.type === ActionType.UPDATE) {
                // await updateProduct(modal.product?.product_id || 0, data);
                if (Number(modal.product?.stock) !== Number(values.stock)) {
                    const stock_take_details = [{
                        product_id: modal.product?.product_id || 0,
                        system_quantity: Number(modal.product?.stock) || 0,
                        actual_quantity: Number(values.stock)
                    }]
                    const newData = {
                        stock_take_details,
                        status: Status.RECEIVED,
                        user_id: userId,
                        warehouse_id: warehouseId,
                        notes: `Phiếu kiểm kho được tạo tự động khi cập nhật Hàng hoá ${modal.product?.product_code}`
                    }
                    await createInventoryCheck(newData);
                }
            }
            setShouldReload(true);
            showSuccessMessage(`${modal.title} thành công!`);
        } catch (error) {
            console.error('Lỗi submit:', error);
            showErrorMessage(`${modal.title} thất bại!`);
        } finally {
            setLoading(false);
            form.resetFields();
            onClose();
        }
    };

    const fetchCategories = async (reload: boolean = false) => {
        try {
            const data = await getCategories();
            const formattedOptions = data.map((item: { category_id: string; category_name: string }) => ({
                label: item.category_name,
                labelText: item.category_name,
                value: item.category_id,
            }));
            setOptionsCategory(formattedOptions);
            if (reload) {
                form.setFieldsValue({ category_id: formattedOptions[formattedOptions.length - 1]?.value });
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchUnits = async (reload: boolean = false) => {
        try {
            const data = await getUnits();

            const formattedOptions = data.map((item: { unit_id: string; unit_name: string }) => ({
                label: item.unit_name,
                labelText: item.unit_name,
                value: item.unit_id,
            }));
            if (reload) {
                form.setFieldsValue({ unit_id: formattedOptions[formattedOptions.length - 1]?.value });
            }
            setOptionsUnit(formattedOptions)
        } catch (error) {
            console.error("Lỗi fetch API:", error);
        }
    };

    useEffect(() => {
        if (modal.open) {
            form.setFieldsValue({ ...modal.product });
            if (!isEmpty(modal.product)) {
                setPrevStock(modal.product.stock);
            }
        }
    }, [modal.open]);

    useEffect(() => {
        fetchCategories();
        fetchUnits();
    }, []);

    useEffect(() => {
        if (shouldReloadCategory) {
            fetchCategories(shouldReloadCategory);
            setShouldReloadCategory(false);
        }
    }, [shouldReloadCategory]);

    useEffect(() => {
        if (shouldReloadUnit) {
            fetchUnits(shouldReloadUnit);
            setShouldReloadUnit(false);
        }
    }, [shouldReloadUnit]);

    return (
        <div>
            <Modal
                title={modal.title}
                open={modal.open}
                onCancel={onClose}
                onOk={() => form.submit()}
                width={900}
                centered
                footer={[
                    <Button key="back" onClick={onClose} icon={<CloseCircleOutlined />}>
                        Huỷ
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                        icon={<SaveOutlined />}
                        loading={loading}
                    >
                        Lưu
                    </Button>,
                ]}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleFinish}
                >
                    <Row gutter={24}>
                        {/* Bên trái */}
                        <Col span={16}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Mã hàng" name="product_code">
                                        <Input placeholder="Mã hàng tự động" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Mã vạch" name="barcode">
                                        <Input placeholder="Mã vạch" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Tên hàng" name="product_name" rules={[{ required: true, message: 'Vui lòng nhập tên hàng' }]}>
                                <Input placeholder="Tên hàng" />
                            </Form.Item>

                            <Form.Item
                                label="Nhóm hàng"
                                name="category_id"
                            // getValueFromEvent={(e) => e} // nhận giá trị trả từ SelectWithButton
                            >
                                <SelectWithButton
                                    options={optionsCategory}
                                    placeholder="---Lựa chọn nhóm hàng---"
                                    onAddClick={() => setModalCategory({ open: true, type: ActionType.CREATE, category: null })}
                                />
                            </Form.Item>


                            <Form.Item label="Đơn vị tính" name="unit_id">
                                <SelectWithButton
                                    options={optionsUnit}
                                    placeholder="---Đơn vị tính---"
                                    onAddClick={() => setModalUnit({ open: true, type: ActionType.CREATE, unit: null })} />
                            </Form.Item>

                            <Form.Item label="Hình ảnh" name="images">
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={({ fileList }) => setFileList(fileList)}
                                    maxCount={5}
                                >
                                    {fileList.length >= 5 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>

                        {/* Bên phải */}
                        <Col span={8}>
                            <Form.Item label="Giá vốn" name="purchase_price">
                                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                            </Form.Item>

                            <Form.Item label="Giá bán" name="selling_price" rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}>
                                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                            </Form.Item>

                            <Form.Item label="Tồn kho" name="stock" rules={[{ required: true, message: 'Vui lòng nhập tồn kho' }]}>
                                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                            </Form.Item>

                            <Form.Item label="Trọng lượng" name="weight">
                                <Input addonAfter="g" style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <CategoryModal />
            <UnitModal />
        </div>
    );
};

export default ProductModal;
