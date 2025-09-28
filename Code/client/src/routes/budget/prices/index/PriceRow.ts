export interface PriceRow {
    productPriceId: number;
    productName: string;
    companyName: string | undefined | null;
    categoryName: string | undefined | null;
    price: number;
    format: string;
    priceDate: string;
    isDiscount: boolean;
    quantity: number | undefined | null;
    description: string | undefined | null;
    isSelected: boolean;
}