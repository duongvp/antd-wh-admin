export enum InvoiceStatus {
    DRAFT = "draft",
    RECEIVED = "completed",
    CANCELLED = "cancelled", // nếu cần mở rộng thêm
}


export const getInvoiceStatusLabel = (status: InvoiceStatus): string => {
    switch (status) {
        case InvoiceStatus.RECEIVED:
            return "Đã hoàn thành";
        case InvoiceStatus.CANCELLED:
            return "Đã huỷ";
        case InvoiceStatus.DRAFT:
            return "Phiếu tạm";
        default:
            return "Phiếu tạm";
    }
};