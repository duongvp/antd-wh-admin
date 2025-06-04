// services/areaService.ts

export const fetchProvinces = async () => {
    try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=2');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy tỉnh thành:', error);
        throw error;
    }
};

export const fetchWards = async (districtCode: string) => {
    try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const data = await response.json();
        return data.wards || [];
    } catch (error) {
        console.error('Lỗi khi lấy phường xã:', error);
        throw error;
    }
};
