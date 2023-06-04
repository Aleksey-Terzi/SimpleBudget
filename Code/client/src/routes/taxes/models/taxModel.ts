export interface TaxIncomeModel {
    paymentId: number;
    companyName: string;
    description: string;
    categoryName: string;
    walletName: string;
    currencyCode: string;
    formattedPaymentDate: string;
    formattedValue: string;
    formattedValueCAD: string;
    formattedRate: string;
}

export interface TaxItemModel {
    name: string;
    diffCAD: number;
    formattedValueCAD: string;
    formattedValuePaidCAD: string;
    formattedDiffCAD: string;
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
    taxDiffTotalCAD: number;
    formattedIncomeTotalCAD: string;
    formattedTaxTotalCAD: string;
    formattedTaxPaidTotalCAD: string;
    formattedTaxDiffTotalCAD: string;
    formattedClosed?: string;
}