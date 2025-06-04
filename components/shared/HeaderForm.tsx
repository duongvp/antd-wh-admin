"use client";
import { DatePicker, Empty, Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import SelectWithButton from '../ui/Selects/SelectWithButton';
import { getUsers, getUsersFollowWarehouse } from '@/services/userService';

const { Text } = Typography;

interface IHeaderFormProps {
    warehouseId: number
    userIdSelected: number;
    setUserIdSelected: React.Dispatch<React.SetStateAction<number>>;
    dateTime: dayjs.Dayjs | null | undefined
    setDateTime: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null | undefined>>
}

const HeaderForm: React.FC<IHeaderFormProps> = ({ warehouseId, userIdSelected, setUserIdSelected, dateTime, setDateTime }) => {
    const [options, setOptions] = useState<any>([]);

    const fetchUsers = async () => {
        try {
            const apiData = await getUsersFollowWarehouse(warehouseId);
            setOptions(apiData.map((item) => ({ label: item.username, labelText: item.username, value: item.user_id })));
        } catch (error) {
            console.error("Lỗi fetch API:", error);
        };
    }

    useEffect(() => {
        if (warehouseId === -1) return;
        fetchUsers();
    }, [warehouseId]);

    return (
        <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
            <Flex align="center">
                <Text strong>👤</Text>
                <SelectWithButton
                    options={options}
                    style={{ width: '100%' }}
                    styleWrapSelect={{ borderBottom: 'none' }}
                    placeholder="người tạo"
                    value={userIdSelected} // <-- dùng state
                    onChange={(value) => setUserIdSelected(Number(value))}
                    allowClear={false}
                    notFoundContent={
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Không có kết quả phù hợp"
                        />
                    }
                />
            </Flex>
            <DatePicker
                showTime={{ format: 'HH:mm' }}
                defaultValue={dateTime}
                format="DD/MM/YYYY HH:mm"
                value={dateTime}
                onChange={(value) => setDateTime(value)}
                allowClear={false}
                suffixIcon={null}
                size="small"
                variant="borderless"
                className="custom-datepicker"
            />
        </Flex>
    );
}

export default HeaderForm;
