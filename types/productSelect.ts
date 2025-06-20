export interface Item {
    no: number;
    itemCode: string;
    id: number;
    itemName: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
    maxQuantity?: number;
}

export interface IDataTypeProductSelect extends Item {
    key: string;
}