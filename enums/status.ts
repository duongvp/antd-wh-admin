export enum Status {
    DRAFT = "draft",
    RECEIVED = "completed",
    CANCELLED = "cancelled",
}

export enum PurchaseOrderStatus {
    DRAFT = "draft",
    RECEIVED = "received",
    CANCELLED = "cancelled",
}


export const getInventoryCheckStatusLabel = (status: Status): string => {
    switch (status) {
        case Status.RECEIVED:
            return "Đã cân bằng kho";
        case Status.CANCELLED:
            return "Đã huỷ";
        case Status.DRAFT:
            return "Phiếu tạm";
        default:
            return "Phiếu tạm";
    }
};

export const getReturnOrderStatusLabel = (status: Status): string => {
    switch (status) {
        case Status.RECEIVED:
            return "Đã trả";
        case Status.CANCELLED:
            return "Đã huỷ";
        case Status.DRAFT:
            return "Phiếu tạm";
        default:
            return "Phiếu tạm";
    }
};