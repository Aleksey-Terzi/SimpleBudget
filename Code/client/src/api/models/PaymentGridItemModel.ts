export interface PaymentGridItemModel {
    paymentId: number;
    paymentDate: string;
    companyName: string | undefined | null;
    description: string | undefined | null;
    categoryName: string | undefined | null;
    walletName: string | undefined | null;
    personName: string | undefined | null;
    valueFormat: string;
    value: number;
    taxable: boolean;
    taxYear: number | undefined | null;
    transferTo: PaymentGridItemModel | undefined | null;
}