export interface SummaryWalletModel {
    walletName: string;
    currencyCode: string;
    valueCAD: number;
    formattedRate: string;
    formattedValue: string;
    formattedValueCAD: string;
}

export interface SummaryCurrencyModel {
    currencyCode: string;
    valueCAD: number;
    formattedRate: string;
    formattedValue: string;
    formattedValueCAD: string;
}

export interface SummaryModel {
    wallets: SummaryWalletModel[];
    currencies: SummaryCurrencyModel[];
    taxCAD: number;
    formattedTotalValue: string;
    formattedTax: string;
    formattedTotalTaxDifference: string;
}