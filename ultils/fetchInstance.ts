// utils/fetchInstance.ts
export const fetchInstance = async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout sau 10 giây

    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal,
            credentials: 'include'
        });
        if (!res.ok) {
            const responseData = await res.json();
            const error = new Error(responseData?.message || `API Error: ${res.status}`);
            (error as any).status = res.status;
            (error as any).detail = responseData;
            throw error;
        }

        return await res.json();
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId); // Xóa timeout khi có kết quả
    }
};
