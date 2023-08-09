export interface SuggestedPaymentModel {
    code: string;
    name: string;
    date: string;
    category?: string;
    company?: string;
    value: number;
}