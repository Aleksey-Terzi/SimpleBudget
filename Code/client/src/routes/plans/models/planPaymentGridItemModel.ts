export interface PlanPaymentGridItemModel {
    planPaymentId: number;
    companyName?: string;
    description?: string;
    categoryName?: string;
    walletName?: string;
    personName?: string;
    value: number;
    taxable: boolean;
    taxYear?: number;
    isActive: boolean;
    isActiveAndInDate: boolean;
    formattedValue: string;
    formattedPaymentDateRange: string;
}