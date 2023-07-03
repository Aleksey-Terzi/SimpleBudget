export interface PaymentGridItemModel {
    paymentId: number;
    paymentDate: string;
    companyName?: string;
    description?: string;
    categoryName?: string;
    walletName?: string;
    personName?: string;
    valueFormat: string;
    value: number;
    taxable: boolean;
    taxYear?: number;
    transferTo?: PaymentGridItemModel;
}