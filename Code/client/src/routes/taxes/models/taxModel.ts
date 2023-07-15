export interface TaxIncomeModel {
    paymentId: number;
    paymentDate: string;
    companyName: string;
    description: string;
    categoryName: string;
    walletName: string;
    currencyCode: string;
    rate: number;
    value: number;
    valueFormat: string;
}

export interface TaxItemModel {
    name: string;
    valueCAD: number;
    valuePaidCAD: number;
}

export interface TaxPersonModel {
    personId: number;
    name: string;
}

export interface TaxModel {
    years: number[];
    persons: TaxPersonModel[];
    incomes: TaxIncomeModel[];
    taxItems: TaxItemModel[];
    selectedPersonId: number;
    selectedYear: number;
    canOpen: boolean;
    closed?: string;
    valueFormatCAD: string;
}