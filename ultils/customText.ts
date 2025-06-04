export const convertStatusToText = (status: boolean): string => {
    if (status) {
        return 'Đang hoạt động';
    } else {
        return 'Ngừng hoạt động';
    }
};