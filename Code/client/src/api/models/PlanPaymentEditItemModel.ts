export interface PlanPaymentEditItemModel {
    isActive: boolean;
    paymentType: string;
    startDate: string;
    endDate: string | undefined | null;
    company: string | undefined | null;
    category: string | undefined | null;
    wallet: string;
    description: string | undefined | null;
    value: number;
    taxable: boolean;
    taxYear: number | undefined | null;
    person: string | undefined | null;
}