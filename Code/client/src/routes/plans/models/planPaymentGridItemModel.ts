export interface PlanPaymentGridItemModel {
    planPaymentId: number;
    paymentStartDate: string;
    paymentEndDate?: string;
    companyName?: string;
    description?: string;
    categoryName?: string;
    walletName?: string;
    personName?: string;
    valueFormat: string;
    value: number;
    taxable: boolean;
    taxYear?: number;
    isActive: boolean;
    isActiveAndInDate: boolean;
}