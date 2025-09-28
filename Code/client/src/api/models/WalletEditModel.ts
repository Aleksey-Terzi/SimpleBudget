export interface WalletEditModel {
    personId: number | undefined | null;
    currencyId: number;
    walletName: string;
    paymentCount: number;
    personName: string | undefined | null;
    currencyCode: string | undefined | null;
}
