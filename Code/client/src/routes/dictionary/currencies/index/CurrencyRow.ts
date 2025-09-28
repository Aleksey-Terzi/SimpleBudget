import { DateParts } from "@/helpers/date/dateTypes";

export interface CurrencyRow {
    currencyId: number;
    code: string;
    valueFormat: string;
    marketStartDate: DateParts | null;
    marketRate: number | null;
    bankStartDate: DateParts | null;
    bankRate: number | null;
}