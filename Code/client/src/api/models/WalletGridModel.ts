export interface WalletGridModel {
    walletId: number;
    walletName: string;
    personName?: string | null;
    currencyCode: string;
    paymentCount: number;
}