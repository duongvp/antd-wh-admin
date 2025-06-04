// services/userService.ts

import { fetchInstance } from "@/ultils/fetchInstance";
import { UserApiResponse } from "./userService";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth`;

export const registerUser = async (payload: UserApiResponse) => {
    const url = `${API_BASE_URL}/register`;
    const options = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return await fetchInstance(url, options);
}

export const loginUser = async (payload: UserApiResponse) => {
    const url = `${API_BASE_URL}/login`;
    const options = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return await fetchInstance(url, options);
}



