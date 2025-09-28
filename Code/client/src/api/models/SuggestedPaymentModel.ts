export interface SuggestedPaymentModel {
    code: string;
    name: string;
    date: string;
    category: string | undefined | null;
    company: string | undefined | null;
    value: number;
}