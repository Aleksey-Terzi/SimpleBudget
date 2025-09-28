export interface TaxIncomeModel {
    paymentId: number;
    paymentDate: string;
    companyName: string | undefined | null;
    description: string | undefined | null;
    categoryName: string | undefined | null;
    walletName: string;
    currencyCode: string;
    rate: number;
    value: number;
    valueFormat: string;
}