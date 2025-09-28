export interface CurrencyGridModel {
    currencyId: number;
    code: string;
    valueFormat: string;
    marketStartDate: string | undefined | null;
    marketRate: number | undefined | null;
    bankStartDate: string | undefined | null;
    bankRate: number | undefined | null;
}
