'use client';
import React, { useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { fetchProvinces, fetchWards } from '@/services/areaService';

const { Option, OptGroup } = Select;

interface District {
    code: string;
    name: string;
}

interface Ward {
    code: string;
    name: string;
}

interface Province {
    code: string;
    name: string;
    districts: District[];
}

interface AreaWardSelectorProps {
    form: any;
}

const AreaWardSelector: React.FC<AreaWardSelectorProps> = ({ form }) => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | null>(null);

    // Fetch tất cả province + districts ban đầu
    useEffect(() => {
        const initializeProvinces = async () => {
            try {
                const data = await fetchProvinces();
                setProvinces(data);

                const area = form.getFieldValue('area');
                if (area) {
                    const [provinceName, districtName] = area.split(' - ');

                    const province = data.find((p: Province) => p.name === provinceName);
                    if (province) {
                        const district = province.districts.find((d: District) => d.name === districtName);
                        if (district) {
                            setSelectedDistrictCode(district.code);
                            // Fetch wards theo district code
                            const wardsData = await fetchWards(district.code);
                            setWards(wardsData);
                        }
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy tỉnh thành:', error);
            }
        };
        initializeProvinces();
    }, [form]);

    // Handle khi thay đổi khu vực
    const handleAreaChange = async (value: string, option: DefaultOptionType) => {
        const districtCode = option['data-district'];
        setSelectedDistrictCode(districtCode);

        form.setFieldsValue({
            ward: undefined, // Reset ward khi đổi khu vực
        });

        const wardsData = await fetchWards(districtCode);
        setWards(wardsData);
    };

    // Handle khi thay đổi phường xã
    const handleWardChange = (value: string) => {
        form.setFieldsValue({
            ward: value,
        });
    };

    return (
        <>
            <Form.Item label="Khu vực" name="area">
                <Select
                    placeholder="Chọn Tỉnh/TP - Quận/Huyện"
                    onChange={handleAreaChange}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        typeof option?.children === 'string' &&
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {provinces.map((province) => (
                        <OptGroup key={province.code} label={province.name}>
                            {province.districts.map((district) => (
                                <Option
                                    key={`${province.code}-${district.code}`}
                                    value={`${province.name} - ${district.name}`}
                                    data-province={province.code}
                                    data-district={district.code}
                                >
                                    {`${province.name} - ${district.name}`}
                                </Option>
                            ))}
                        </OptGroup>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="Phường xã" name="ward">
                <Select
                    key={selectedDistrictCode || 'no-district'}
                    placeholder="Chọn Phường/Xã"
                    onChange={handleWardChange}
                    showSearch
                    disabled={!selectedDistrictCode}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        typeof option?.children === 'string' &&
                        (option.children as String).toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {wards.map((ward) => (
                        <Option key={ward.code} value={ward.name}>
                            {ward.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </>
    );
};

export default AreaWardSelector;
