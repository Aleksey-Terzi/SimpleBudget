export interface PaymentGridItemModel {
    paymentId: number;
    formattedPaymentDate: string;
    companyName?: string;
    description?: string;
    categoryName?: string;
    walletName?: string;
    personName?: string;
    formattedValue: string;
    value: number;
    taxable: boolean;
    taxYear?: number;
    transferTo?: PaymentGridItemModel;
}