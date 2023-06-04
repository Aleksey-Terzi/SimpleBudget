export interface PaymentModel {
    paymentType: string;
    date: string;
    company?: string;
    category?: string;
    wallet?: string;
    description?: string;
    value: number;
    taxable: boolean;
    taxYear?: number;
    walletTo?: string;
    valueTo?: number;
    person?: string;
}