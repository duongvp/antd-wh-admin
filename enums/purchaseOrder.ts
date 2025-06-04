export enum POStatus {
    DRAFT = "draft",
    RECEIVED = "received",
    CANCELLED = "cancelled",
}


export const getPOStatusLabel = (status: POStatus): string => {
    switch (status) {
        case POStatus.RECEIVED:
            return "Đã nhập hàng";
        case POStatus.CANCELLED:
            return "Đã huỷ";
        case POStatus.DRAFT:
            return "Phiếu tạm";
        default:
            return "Phiếu tạm";
    }
};