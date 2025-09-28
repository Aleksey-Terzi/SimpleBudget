export interface MonthlyWalletModel {
    walletName: string;
    currencyCode: string;
    valueFormat: string;
    beginning: number;
    current: number;
    beginningRate: number;
    currentRate: number;
}
