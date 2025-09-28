import { TaxIncomeModel } from "./TaxIncomeModel";
import { TaxItemModel } from "./TaxItemModel";
import { TaxPersonModel } from "./TaxPersonModel";

export interface TaxModel {
    years: number[];
    persons: TaxPersonModel[];
    incomes: TaxIncomeModel[];
    taxItems: TaxItemModel[];
    selectedPersonId: number | undefined | null;
    selectedYear: number;
    canOpen: boolean;
    closed: string | undefined | null;
    valueFormatCAD: string;
}
