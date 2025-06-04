import { useEffect, useState } from 'react';
import { Form, Typography, Button, Divider, Flex, Input, Empty, Spin } from 'antd';
import { CheckOutlined, SaveOutlined } from '@ant-design/icons';
import CustomInput from '@/components/ui/Inputs'; // bạn nhớ tạo cho chuẩn nhé
import SelectWithButton from '@/components/ui/Selects/SelectWithButton';
import { IInvoiceDetail, ITypeImportInvoice } from '@/types/invoice';
import useCustomerSelect from '@/hooks/useCustomerSelect';
import CustomerModal from '@/app/(admin)/partners/customers/components/Modal/CustomerModal';
import useCustomerStore from '@/stores/customerStore';
import { getInvoiceStatusLabel, InvoiceStatus } from '@/enums/invoice';
import HeaderForm from '@/components/shared/HeaderForm';
import { ActionType } from '@/enums/action';
import { showErrorMessage, showSuccessMessage } from '@/ultils/message';
import { createInvoice, updateInvoice, updateInvoicePayment } from '@/services/invoiceService';
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores/authStore';
import { isEmpty } from 'lodash';

const { Text } = Typography;

interface ImportOrdersFormProps {
    subtotal: number;
    type?: ITypeImportInvoice;
    invoiceDetails?: Partial<IInvoiceDetail>;
    invoiceSummary?: any;
    selectedProducts?: any;
}

export default function ImportOrdersForm({ subtotal, type, invoiceDetails, invoiceSummary, selectedProducts }: ImportOrdersFormProps) {
    const [form] = Form.useForm();
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [customerPayment, setCustomerPayment] = useState<number>(0);
    const { setModal } = useCustomerStore();
    const [searchTerm, setSearchTerm] = useState('');
    const { options, handleScroll } = useCustomerSelect(searchTerm)
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { warehouseId, userId } = useAuthStore(state => state.user);
    const [userIdSelected, setUserIdSelected] = useState<number>(userId);
    const [dateTimeSelected, setDateTimeSelected] = useState<dayjs.Dayjs | null | undefined>(dayjs());
    const [statusInvoice, setStatusInvoice] = useState<InvoiceStatus>(InvoiceStatus.DRAFT);

    const handleSave = async () => {
        try {
            setLoadingSave(true);
            const values = form.getFieldsValue();
            await handleCreateInvoice(values, InvoiceStatus.DRAFT);
        } finally {
            setLoadingSave(false);
        }
    };

    const handleFinish = async (values: any) => {
        try {
            setLoadingSubmit(true);
            await handleCreateInvoice(values, InvoiceStatus.RECEIVED);
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handlePayment = async () => {
        try {
            setLoadingSubmit(true);
            await updateInvoicePayment(invoiceDetails?.invoice_id || 0, { amount_paid: customerPayment, debt_amount: calculateDebt() });
            showSuccessMessage('Thanh toán hóa đơn công!');
        } catch (error) {
            console.log('error', error);
            showErrorMessage('Thanh toán hóa đơn thất bại');
        }
        finally {
            setLoadingSubmit(false);
        }
    };

    const handleCreateInvoice = async (values: any, type: InvoiceStatus) => {
        if (warehouseId === -1) return
        try {
            console.log('selectedProducts', selectedProducts);
            const details = selectedProducts.map((item: any) => ({
                product_id: item.id,
                quantity: item.quantity,
                discount: item.discount,
                unit_price: item.unitPrice,
                total_price: item.totalPrice
            }))
            const newValues = {
                customer_id: values.customer_id,
                user_id: userIdSelected,
                warehouse_id: warehouseId,
                subtotal,
                discount_amount: discountAmount,
                total_amount: calculateTotal(),
                amount_paid: customerPayment,
                debt_amount: calculateDebt(),
                invoice_date: dateTimeSelected?.format('YYYY-MM-DD HH:mm:ss'),
                status: type,
                notes: values.notes,
                details
            }
            console.log('newValues', newValues);
            await createInvoice(newValues);
            showSuccessMessage(InvoiceStatus.RECEIVED === type ? 'Tạo hoá đơn thành công' : 'Tạo hoá đơn tạm thành công')
        } catch (error) {
            console.error('error', error);
            showErrorMessage(InvoiceStatus.RECEIVED === type ? 'Tạo hoá đơn thất bại' : 'Tạo hoá đơn tạm thất bại')
        }
    }

    const calculateTotal = () => {
        const total = subtotal - discountAmount;
        return total >= 0 ? total : 0;
    };

    const calculateDebt = () => {
        const total = customerPayment - calculateTotal();
        return total;
    };

    useEffect(() => {
        if (!isEmpty(invoiceDetails) && !isEmpty(invoiceSummary)) {
            form.setFieldsValue({
                customer_id: invoiceDetails?.customer_id,
                invoice_code: invoiceDetails?.invoice_code
            });
            setUserIdSelected(invoiceDetails?.user_id as number);
            setDateTimeSelected(dayjs(invoiceDetails?.invoice_date));
            setDiscountAmount(invoiceSummary?.discount_amount);
            setCustomerPayment(invoiceSummary?.amount_paid);
            setStatusInvoice(invoiceDetails?.status as InvoiceStatus)
        }
    }, [invoiceDetails, type, invoiceSummary])

    useEffect(() => {
        if (userId !== -1) setUserIdSelected(userId)
    }, [userId])

    useEffect(() => {
        if (type == "create") {
            setCustomerPayment(calculateTotal())
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

                    {/* Khách hàng */}
                    <Form.Item name="customer_id">
                        <SelectWithButton
                            options={options}
                            style={{ width: '100%' }}
                            styleWrapSelect={{ borderBottom: '1px solid #d9d9d9' }}
                            placeholder="Tìm khách hàng"
                            onSearch={setSearchTerm}
                            onAddClick={() => setModal({ open: true, type: ActionType.CREATE, customer: null })}
                            onPopupScroll={handleScroll}
                            notFoundContent={
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="Không có kết quả phù hợp"
                                />
                            }
                        />
                    </Form.Item>

                    {/* Các trường nhập liệu */}
                    <Form.Item name="invoice_code">
                        <CustomInput label="Mã phiếu đặt" name="invoice_code" placeholder="Mã phiếu tự động" disabled={statusInvoice === InvoiceStatus.RECEIVED} />
                    </Form.Item>
                    {/* <CustomInput label="Mã đặt hàng nhập" name="orderCode" placeholder="" /> */}
                    <Flex style={{ marginTop: 12, marginBottom: 8 }}>
                        <Text style={{ width: 120 }}>Trạng thái</Text>
                        <Text style={{ paddingLeft: 11 }}>{statusInvoice === InvoiceStatus.DRAFT ? "Phiếu tạm" : "Đã hoàn thành"}</Text>
                    </Flex>
                    <Divider />

                    <Flex justify='space-between' style={{ marginBottom: 8 }}>
                        <Text>Tổng số hàng đặt</Text>
                        <Text>{subtotal.toLocaleString()}</Text>
                    </Flex>

                    {/* Tổng tiền */}
                    <Flex justify='space-between' style={{ marginBottom: 8 }}>
                        <Text strong >Tổng tiền hàng</Text>
                        <Text>{subtotal.toLocaleString()}</Text>
                    </Flex>

                    {/* Giảm giá */}
                    <CustomInput
                        label="Giảm giá"
                        name="discount_amount"
                        isNumber
                        lablelStyle={{ width: "70%" }}
                        inputNumberProps={{
                            disabled: statusInvoice === InvoiceStatus.RECEIVED,
                            min: 0,
                            value: discountAmount,
                            formatter: (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            parser: (val) => val?.replace(/,/g, '') || '0',
                            onChange: (value) => setDiscountAmount(Number(value) || 0),
                        }}
                    />

                    {/* Cần trả */}
                    <Flex justify="space-between" style={{ marginBottom: 16, marginTop: 12 }}>
                        <Text strong>Khách cần trả</Text>
                        <Text>{calculateTotal().toLocaleString()}</Text>
                    </Flex>


                    <CustomInput
                        label="Khách thanh toán"
                        name="amount_paid"
                        isNumber
                        lablelStyle={{ width: "70%" }}
                        inputNumberProps={{
                            min: 0,
                            value: customerPayment,
                            formatter: (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            parser: (val) => val?.replace(/,/g, '') || '0',
                            onChange: (value) => setCustomerPayment(Number(value) || 0),
                        }}
                    />

                    <Flex justify="space-between" style={{ marginBottom: 16, marginTop: 12 }}>
                        <Text strong>Tính vào công nợ</Text>
                        <Text>{calculateDebt().toLocaleString()}</Text>
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
                {
                    statusInvoice === InvoiceStatus.DRAFT ? (
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
                    ) : (
                        <Flex gap={8}>
                            <Button
                                type='primary'
                                onClick={handlePayment}
                                style={{ flex: 1 }}
                                icon={<CheckOutlined />}
                                loading={loadingSubmit}
                            >
                                Thanh toán
                            </Button>
                        </Flex>
                    )
                }


            </Flex>
            <CustomerModal />
        </Form>
    );
}
