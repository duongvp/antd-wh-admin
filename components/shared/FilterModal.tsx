// components/FilterDrawer.tsx
import React, { useState } from 'react';
import { Drawer, Form, Select, DatePicker, Checkbox, Button, Row, Col, Empty } from 'antd';
import dayjs from 'dayjs';
import SelectWithButton from '../ui/Selects/SelectWithButton';
import useCustomerSelect from '@/hooks/useCustomerSelect';
import { getInvoicesByPage } from '@/services/invoiceService';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterDrawerProps {
    open: boolean;
    onClose: () => void;
    handleSearch: (value: any) => void;
    title?: string
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ open, onClose, handleSearch, title = 'Bộ lọc hóa đơn' }) => {
    const [form] = Form.useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const { options, handleScroll } = useCustomerSelect(searchTerm)

    const onFinish = async (values: any) => {
        const { dateTime, ...rest } = values;

        const rawFilter = {
            ...rest,
            invoice_date: dateTime?.length === 2
                ? [
                    dayjs(dateTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    dayjs(dateTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                ]
                : undefined,
        };

        const filter = Object.fromEntries(
            Object.entries(rawFilter).filter(([_, value]) => {
                if (value == null) return false; // null or undefined
                if (Array.isArray(value) && value.length === 0) return false; // empty array
                if (typeof value === 'string' && value.trim() === '') return false; // empty string
                return true;
            })
        );
        handleSearch(filter);
        onClose();
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Drawer
            title={title}
            placement="right"
            onClose={onClose}
            open={open}
            width={600}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onReset} style={{ marginRight: 8 }}>
                        Đặt lại
                    </Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        Áp dụng
                    </Button>
                </div>
            }
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Thời gian */}
                <Form.Item
                    name="dateTime"
                    label={<span style={{ fontWeight: 600, color: '#222' }}>Thời gian</span>}
                    style={{ marginBottom: 16 }}>
                    <RangePicker
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                        getPopupContainer={(trigger) => trigger.parentElement!}
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                </Form.Item>

                {/* Trạng thái */}
                <Form.Item
                    label={<span style={{ fontWeight: 600, color: '#222' }}>Trạng thái</span>}
                    name="status"
                    style={{ marginBottom: 16 }}>
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Row gutter={[0, 8]}>
                            <Col span={24}><Checkbox value="draft">Phiếu tạm</Checkbox></Col>
                            <Col span={24}><Checkbox value="completed">Hoàn thành</Checkbox></Col>
                            <Col span={24}><Checkbox value="cancelled">Đã hủy</Checkbox></Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                {/* Người bán */}
                <Form.Item
                    label={<span style={{ fontWeight: 600, color: '#222' }}>Khách hàng</span>}
                    name="customer_id"
                    style={{ marginBottom: 16 }}>
                    <SelectWithButton
                        options={options}
                        style={{ width: '100%' }}
                        placeholder="Chọn khách hàng"
                        onSearch={setSearchTerm}
                        onPopupScroll={handleScroll}
                        notFoundContent={
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Không có kết quả phù hợp"
                            />
                        }
                    />
                </Form.Item>

                {/* Người tạo */}
                <Form.Item
                    label={<span style={{ fontWeight: 600, color: '#222' }}>Người tạo</span>}
                    name="creator"
                    style={{ marginBottom: 16 }}>
                    <Select placeholder="Chọn người tạo" allowClear showSearch>
                        <Option value="user1">Người 1</Option>
                        <Option value="user2">Người 2</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default FilterDrawer;
