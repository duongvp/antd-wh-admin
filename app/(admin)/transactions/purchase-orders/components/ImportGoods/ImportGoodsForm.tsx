import { useEffect, useState } from 'react';
import { Form, Typography, Button, Divider, Flex, Input } from 'antd';
import { CheckOutlined, SaveOutlined } from '@ant-design/icons';
import CustomInput from '@/components/ui/Inputs'; // bạn nhớ tạo cho chuẩn nhé
import SelectWithButton from '@/components/ui/Selects/SelectWithButton';
import SupplierModal from '@/app/(admin)/partners/suppliers/components/Modal/SupplierModal';
import useSupplierStore from '@/stores/supplierStore';
import { useSupplierSelect } from '@/hooks/useSupplierSelect';
import HeaderForm from '@/components/shared/HeaderForm';
import { createPurchaseOrder, IPurchaseOrderBase, IPurchaseOrderSummary, updatePurchaseOrder } from '@/services/purchaseOrderService';
import { create, isEmpty } from 'lodash';
import { ActionType } from '@/enums/action';
import { showErrorMessage, showSuccessMessage } from '@/ultils/message';
import { PurchaseOrderStatus } from '@/enums/status';
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores/authStore';
import { ITypeImportInvoice } from '@/types/invoice';

const { Text } = Typography;

interface ImportGoodsFormProps {
    subtotal: number;
    poInfos: Partial<IPurchaseOrderBase>;
    poSummary?: Partial<IPurchaseOrderSummary>;
    type?: ITypeImportInvoice;
    selectedProducts?: any;

}

export default function ImportGoodsForm({ subtotal, poInfos, poSummary, type, selectedProducts }: ImportGoodsFormProps) {
    const [form] = Form.useForm();
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [paymentToSupplier, setPaymentToSupplier] = useState<number>(0);
    const [debt, setDebt] = useState<number>(0);
    const { setModal } = useSupplierStore();
    const { options } = useSupplierSelect()
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { warehouseId, userId } = useAuthStore(state => state.user);
    const [userIdSelected, setUserIdSelected] = useState<number>(userId);
    const [dateTimeSelected, setDateTimeSelected] = useState<dayjs.Dayjs | null | undefined>(dayjs());


    const calculateTotal = () => {
        const total = subtotal - discountAmount;
        return total >= 0 ? total : 0;
    };

    const calculateDebt = () => {
        const total = paymentToSupplier - calculateTotal();
        setDebt(total);
    };

    const handleSave = async () => {
        try {
            setLoadingSave(true);
            const values = form.getFieldsValue();
            await handleCreatePurchaseOrder(values, PurchaseOrderStatus.DRAFT);
        } finally {
            setLoadingSave(false);
        }
    };

    const handleFinish = async (values: any) => {
        try {
            setLoadingSubmit(true);
            await handleCreatePurchaseOrder(values, PurchaseOrderStatus.RECEIVED);
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleCreatePurchaseOrder = async (values: any, status: PurchaseOrderStatus) => {
        try {
            const details = selectedProducts.map((item: any) => ({
                product_id: item.id,
                quantity: item.quantity,
                discount: item.discount,
                unit_price: item.unitPrice,
                total_price: item.totalPrice
            }))
            const newValues = {
                supplier_id: values.supplier_id,
                user_id: userIdSelected,
                warehouse_id: warehouseId,
                subtotal,
                discount_amount: discountAmount,
                total_amount: calculateTotal(),
                amount_paid: paymentToSupplier,
                debt_amount: debt,
                order_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                status: status,
                details
            }
            if (type === 'edit') {
                await updatePurchaseOrder(poInfos.po_id ?? 0, newValues);
                showSuccessMessage(PurchaseOrderStatus.RECEIVED === status ? 'Cập nhật phiếu nhập thành công' : 'Cập nhật phiếu tạm thành công')
            } else {
                await createPurchaseOrder(newValues);
                showSuccessMessage(PurchaseOrderStatus.RECEIVED === status ? 'Tạo phiếu nhập thành công' : 'Tạo phiếu tạm thành công')
            }
        } catch (error) {
            console.error('error', error);
            if (type === 'edit') {
                showErrorMessage(PurchaseOrderStatus.RECEIVED === status ? 'Cập nhật phiếu nhập thất bại' : 'Cập nhật phiếu tạm thất bại')
            } else {
                showErrorMessage(PurchaseOrderStatus.RECEIVED === status ? 'Tạo phiếu nhập thất bại' : 'Tạo phiếu tạm thất bại')
            }
        }
    }


    useEffect(() => {
        if (!isEmpty(poInfos)) {
            form.setFieldsValue({ supplier_id: poInfos?.supplier_id });
            if (type === 'edit') {
                form.setFieldsValue({ po_code: poInfos?.po_code });
            }
            setUserIdSelected(poInfos?.user_id as number);
            setDateTimeSelected(dayjs(poInfos?.order_date));
            if (poSummary) {
                setDiscountAmount(Number(poSummary?.discount_amount) || 0);
                setPaymentToSupplier(Number(poSummary?.amount_paid) || 0);
            }
        }
    }, [poInfos, type, poSummary])

    useEffect(() => {
        calculateDebt();
    }, [subtotal, discountAmount, paymentToSupplier]);

    useEffect(() => {
        if (userId !== -1) setUserIdSelected(userId)
    }, [userId])

    useEffect(() => {
        if (type == "create") {
            setPaymentToSupplier(calculateTotal())
        }
    }, [subtotal, discountAmount, type])

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

                    {/* Tìm nhà cung cấp */}
                    <Form.Item name="supplier_id">
                        <SelectWithButton options={options} styleWrapSelect={{ borderBottom: '1px solid #d9d9d9' }} style={{ width: "100%" }} placeholder="Tìm nhà cung cấp" onAddClick={() => setModal({ open: true, type: ActionType.CREATE, suppliers: null })} />
                    </Form.Item>

                    {/* Các trường nhập liệu */}
                    <Form.Item name="po_code">
                        <CustomInput label="Mã phiếu nhập" name="po_code" placeholder="Mã phiếu tự động" />
                    </Form.Item>
                    {/* <CustomInput label="Mã đặt hàng nhập" name="orderCode" placeholder="" /> */}
                    <Flex style={{ marginTop: 12, marginBottom: 8 }}>
                        <Text style={{ width: 120 }}>Trạng thái</Text>
                        <Text style={{ paddingLeft: 11 }}>Phiếu tạm</Text>
                    </Flex>
                    <Divider />

                    {/* Tổng tiền */}
                    <Flex justify='space-between' style={{ marginBottom: 8 }}>
                        <Text strong >Tổng tiền hàng</Text>
                        <Text>{subtotal.toLocaleString()}</Text>
                    </Flex>

                    {/* Giảm giá */}
                    <CustomInput
                        label="Giảm giá"
                        name="discountAmount"
                        isNumber
                        lablelStyle={{ width: "70%" }}
                        inputNumberProps={{
                            min: 0,
                            value: discountAmount,
                            formatter: (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            parser: (val) => val?.replace(/,/g, '') || '0',
                            onChange: (value) => setDiscountAmount(Number(value) || 0),
                        }}
                    />

                    {/* Cần trả */}
                    <Flex justify="space-between" style={{ marginBottom: 16, marginTop: 12 }}>
                        <Text strong>Cần trả nhà cung cấp</Text>
                        <Text>{calculateTotal().toLocaleString()}</Text>
                    </Flex>

                    <CustomInput
                        label="Tiền trả NCC"
                        name="paymentToSupplier"
                        isNumber
                        lablelStyle={{ width: "70%" }}
                        inputNumberProps={{
                            min: 0,
                            value: paymentToSupplier,
                            formatter: (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            parser: (val) => val?.replace(/,/g, '') || '0',
                            onChange: (value) => setPaymentToSupplier(Number(value) || 0),
                        }}
                    />

                    <Flex justify="space-between" style={{ marginBottom: 16, marginTop: 12 }}>
                        <Text strong>Tính vào công nợ</Text>
                        <Text>{debt.toLocaleString()}</Text>
                    </Flex>

                    {/* Ghi chú */}
                    <Form.Item name="note">
                        <Input.TextArea
                            placeholder="Ghi chú"
                            autoSize={{ minRows: 3 }}
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                </div>

                {/* Các nút thao tác */}
                <Flex gap={8}>
                    <Button
                        type="default"
                        style={{ flex: 1 }}
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={loadingSave}
                    >
                        Lưu tạm
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ flex: 1 }}
                        icon={<CheckOutlined />}
                        loading={loadingSubmit}
                    >
                        Hoàn thành
                    </Button>
                </Flex>
            </Flex>
            <SupplierModal />
        </Form>
    );
}
