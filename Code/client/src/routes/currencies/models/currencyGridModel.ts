export interface CurrencyGridModel {
    currencyId: number;
    code: string;
    valueFormat: string;
    marketStartDate?: string;
    marketRate?: number;
    bankStartDate?: string;
    bankRate?: number;
}