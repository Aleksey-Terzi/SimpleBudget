export interface PlanPaymentGridItemModel {
    planPaymentId: number;
    paymentStartDate: string;
    paymentEndDate: string | undefined | null;
    companyName: string | undefined | null;
    description: string | undefined | null;
    categoryName: string | undefined | null;
    walletName: string | undefined | null;
    personName: string | undefined | null;
    valueFormat: string;
    value: number;
    taxable: boolean;
    taxYear: number | undefined | null;
    isActive: boolean;
    isActiveAndInDate: boolean;
}