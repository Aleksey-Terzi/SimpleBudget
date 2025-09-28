import { MonthlyCategoryModel } from "./MonthlyCategoryModel";
import { MonthlySummaryModel } from "./MonthlySummaryModel";
import { MonthlyWalletModel } from "./MonthlyWalletModel";

export interface MonthlyModel
{
    selectedYear: number;
    selectedMonth: number;
    showWeekly: boolean;
    wallets: MonthlyWalletModel[];
    categories: MonthlyCategoryModel[];
    summaries: MonthlySummaryModel[];
    years: number[];
    valueFormatCAD: string;
}
