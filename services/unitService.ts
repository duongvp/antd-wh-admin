// services/unitService.ts

import { fetchInstance } from "@/ultils/fetchInstance";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/units`;

export interface UnitApiResponse {
    unit_id: string;
    unit_name: string;
}

export const getUnits = async (): Promise<UnitApiResponse[]> => {
    const url = API_BASE_URL;
    return await fetchInstance(url);
};

export const createUnit = async (payload: { unit_name: string }) => {
    const url = API_BASE_URL;
    const options = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return await fetchInstance(url, options);
};
