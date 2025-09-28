export interface NewImportPaymentModel {
    code: string;
    date: string;
    category: string | undefined | null;
    company: string | undefined | null;
    value: number;
    description: string | undefined | null;
}