export interface PaymentEditItemModel {
    paymentType: string;
    date: string;
    company: string | undefined | null;
    category: string | undefined | null;
    wallet: string;
    description: string | undefined | null;
    value: number;
    taxable: boolean;
    taxYear: number | undefined | null;
    walletTo: string | undefined | null;
    valueTo: number | undefined | null;
    person: string | undefined | null;
}