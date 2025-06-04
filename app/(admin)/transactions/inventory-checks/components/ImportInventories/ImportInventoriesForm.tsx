import { useEffect, useState } from 'react';
import { Form, Typography, Button, Flex, Input } from 'antd';
import { CheckOutlined, SaveOutlined } from '@ant-design/icons';
import CustomInput from '@/components/ui/Inputs'; // bạn nhớ tạo cho chuẩn nhé
import HeaderForm from '@/components/shared/HeaderForm';
import { createInventoryCheck, updateInventoryCheck } from '@/services/inventoryCheckService';
import { showErrorMessage, showSuccessMessage } from '@/ultils/message';
import { useAuthStore } from '@/stores/authStore';
import dayjs from 'dayjs';
import { Status } from '@/enums/status';
import { ITypeImportInvoice } from '@/types/invoice';

const { Text } = Typography;

interface ImportInventoriesFormProps {
    totalActualQuantity: number;
    data: any;
    type?: ITypeImportInvoice
    slug?: number
}

export default function ImportInventoriesForm({ totalActualQuantity, data, type, slug = 0 }: ImportInventoriesFormProps) {
    const [form] = Form.useForm();
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [loadingTemporary, setLoadingTemporary] = useState<boolean>(false);
    const { warehouseId, userId } = useAuthStore(state => state.user);
    const [userIdSelected, setUserIdSelected] = useState<number>(userId);
    const [dateTimeSelected, setDateTimeSelected] = useState<dayjs.Dayjs | null | undefined>(dayjs());

    const handleTemporary = async () => {
        try {
            setLoadingTemporary(true);
            const values = form.getFieldsValue();
            await handleCreateInventoryCheck(values, Status.DRAFT);
        } finally {
            setLoadingTemporary(false);
        }
    }

    const handleFinish = async (values: any) => {
        try {
            setLoadingSubmit(true);
            await handleCreateInventoryCheck(values, Status.RECEIVED);
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleCreateInventoryCheck = async (values: any, status: string) => {
        if (warehouseId === -1) return
        // const data = {
        //     "warehouse_id": 1,
        //     "user_id": 101,
        //     "start_date": "2025-05-20T08:00:00.000Z",
        //     "end_date": "2025-05-20T10:00:00.000Z",
        //     "status": "completed",
        //     "stock_take_details": [
        //         {
        //             "product_id": 1,
        //             "system_quantity": 50,
        //             "actual_quantity": 47
        //         },
        //         {
        //             "product_id": 2,
        //             "system_quantity": 30,
        //             "actual_quantity": 30
        //         },
        //         {
        //             "product_id": 3,
        //             "system_quantity": 80,
        //             "actual_quantity": 90
        //         }
        //     ]
        // }
        try {
            const stock_take_details = data.map((item: any) => ({
                product_id: item.id,
                system_quantity: item.tonkho,
                actual_quantity: item.quantity
            }))
            const newData = {
                stock_take_code: values.stock_take_code,
                stock_take_details,
                status: status,
                user_id: userIdSelected,
                warehouse_id: warehouseId,
                notes: values.notes
            }
            if (type === "edit") {
                await updateInventoryCheck(slug, newData);
                showSuccessMessage(status === 'completed' ? 'Cập nhật phiếu kiểm kho thành công' : 'Cập nhật phiếu tạm thông')
            } else {
                await createInventoryCheck(newData);
                showSuccessMessage(status === 'completed' ? 'Tạo phiếu kiểm kho thành công' : 'Tạo phiếu tạm thành công')
            }
        } catch (error) {
            console.error('error', error);
            if (type === "edit") {
                showErrorMessage(status === 'completed' ? 'Cập nhật phiếu kiểm kho thất bại' : 'Cập nhật phiếu tạm thất bại')
            } else {
                showErrorMessage(status === 'completed' ? 'Tạo phiếu kiểm kho thất bại' : 'Tạo phiếu tạm thất bại')
            }
        }
    }

    useEffect(() => {
        if (userId !== -1) setUserIdSelected(userId)
    }, [userId])

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            style={{ height: '100%' }}
        >
            <Flex vertical justify="space-between" style={{ height: '100%' }}>
                {/* Nội dung form */}
                <div>
                    {/* Header */}
                    <HeaderForm
                        warehouseId={warehouseId}
                        userIdSelected={userIdSelected}
                        setUserIdSelected={setUserIdSelected}
                        dateTime={dateTimeSelected}
                        setDateTime={setDateTimeSelected}
                    />


                    {/* Các trường nhập liệu */}
                    <Form.Item name="stock_take_code">
                        <CustomInput label="Mã kiểm kho" name="stock_take_code" placeholder="Mã phiếu tự động" />
                    </Form.Item>
                    {/* <CustomInput label="Mã đặt hàng nhập" name="orderCode" placeholder="" /> */}
                    <Flex style={{ marginTop: 12, marginBottom: 16 }}>
                        <Text style={{ width: 120 }}>Trạng thái</Text>
                        <Text style={{ paddingLeft: 11 }}>Phiếu tạm</Text>
                    </Flex>
                    <Flex style={{ marginBottom: 16 }}>
                        <Text>Tổng số lượng thực tế :</Text>
                        <Text style={{ paddingLeft: 24 }}>{totalActualQuantity.toLocaleString()}</Text>
                    </Flex>
                    {/* Ghi chú */}
                    <Form.Item name="notes">
                        <Input.TextArea
                            placeholder="Ghi chú"
                            autoSize={{ minRows: 3 }}
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                </div>

                {/* Các nút thao tác */}
                <Flex gap={8}>
                    <Button type="default" style={{ flex: 1 }} icon={<SaveOutlined />} onClick={handleTemporary} loading={loadingTemporary}>
                        Lưu tạm
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ flex: 1 }} icon={<CheckOutlined />} loading={loadingSubmit}>
                        Hoàn thành
                    </Button>
                </Flex>
            </Flex>
        </Form >
    );
}
