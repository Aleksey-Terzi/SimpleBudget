export interface MonthlyWalletModel {
    walletName: string;
    currencyCode: string;
    valueFormat: string;
    beginning: number;
    current: number;
    beginningRate: number;
    currentRate: number;
}

export interface MonthlyCategoryModel {
    categoryName: string;
    monthCAD: number;
    planCAD: number;
    needCAD: number;
    weekCAD: number;
}

export interface MonthlySummaryModel {
    name: string;
    beginningCAD: number;
    currentCAD: number;
}

export interface MonthlyModel {
    selectedYear: number;
    selectedMonth: number;
    showWeekly: boolean;
    wallets: MonthlyWalletModel[];
    categories: MonthlyCategoryModel[];
    summaries: MonthlySummaryModel[];
    years: number[];
    valueFormatCAD: string;
}