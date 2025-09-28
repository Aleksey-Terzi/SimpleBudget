export interface WalletRow {
    walletId: number;
    walletName: string;
    personName: string | null;
    currencyCode: string;
    paymentCount: number;
}