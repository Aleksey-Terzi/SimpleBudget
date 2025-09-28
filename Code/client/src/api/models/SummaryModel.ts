import { SummaryCurrencyModel } from "./SummaryCurrencyModel";
import { SummaryWalletModel } from "./SummaryWalletModel";

export interface SummaryModel {
    wallets: SummaryWalletModel[];
    currencies: SummaryCurrencyModel[];
    valueFormatCAD: string;
    taxCAD: number;
}
