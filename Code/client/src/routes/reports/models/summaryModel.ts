export interface SummaryWalletModel {
    walletName: string;
    currencyCode: string;
    valueFormat: string;
    value: number;
    rate: number;
}

export interface SummaryCurrencyModel {
    currencyCode: string;
    valueFormat: string;
    value: number;
    rate: number;
}

export interface SummaryModel {
    wallets: SummaryWalletModel[];
    currencies: SummaryCurrencyModel[];
    valueFormatCAD: string;
    taxCAD: number;
}