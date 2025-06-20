import { getUsersFollowWarehouse } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";

const useUserSelect = () => {
    const [options, setOptions] = useState<any>([]);
    const { warehouseId } = useAuthStore(state => state.user);

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


    return {
        options
    };
}

export default useUserSelect;
