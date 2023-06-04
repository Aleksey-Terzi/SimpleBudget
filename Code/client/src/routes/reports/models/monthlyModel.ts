export interface MonthlyWalletModel {
    walletName: string;
    currencyCode: string;
    beginningCAD: number;
    currentCAD: number;
    diffCAD: number;
    formattedBeginning: string;
    formattedBeginningCAD: string;
    formattedCurrent: string;
    formattedCurrentCAD: string;
    formattedDiffCAD: string;
    formattedBeginningRate: string;
    formattedCurrentRate: string;
}

export interface MonthlyCategoryModel {
    categoryName: string;
    monthCAD: number;
    planCAD: number;
    needCAD: number;
    weekCAD: number;
    formattedMonthCAD: string;
    formattedPlanCAD: string;
    formattedNeedCAD: string;
    formattedWeekCAD: string;
}

export interface MonthlySummaryModel {
    name: string;
    beginningCAD: number;
    currentCAD: number;
    diffCAD: number;
    formattedBeginningCAD: string;
    formattedCurrentCAD: string;
    formattedDiffCAD: string;
}

export interface MonthlyModel {
    selectedYear: number;
    selectedMonth: number;
    showWeekly: boolean;
    formattedTotalCategoryMonthCAD: string;
    formattedTotalCategoryPlanCAD: string;
    formattedTotalCategoryNeedCAD: string;
    formattedTotalCategoryWeekCAD: string;
    formattedTotalWalletBeginningCAD: string;
    formattedTotalWalletCurrentCAD: string;
    formattedTotalWalletDiffCAD: string;
    formattedTotalSummaryBeginningCAD: string;
    formattedTotalSummaryCurrentCAD: string;
    formattedTotalSummaryDiffCAD: string;
    wallets: MonthlyWalletModel[];
    categories: MonthlyCategoryModel[];
    summaries: MonthlySummaryModel[];
    years: number[];
    monthNames: string[];
}