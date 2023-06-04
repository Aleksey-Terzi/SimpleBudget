export interface PlanPaymentModel {
    isActive: boolean;
    paymentType: string;
    startDate: string;
    endDate?: string;
    company?: string;
    category?: string;
    wallet: string;
    description?: string;
    value: number;
    taxable: boolean;
    taxYear?: number;
    person?: string;
}