export interface PaymentRow {
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
    transferToPaymentId: number | undefined | null;
    transferToValue: number | undefined | null;
    transferToValueFormat: string | undefined | null;
    transferToWalletName: string | undefined | null;
    isSelected: boolean;
    isSum: boolean;
}
