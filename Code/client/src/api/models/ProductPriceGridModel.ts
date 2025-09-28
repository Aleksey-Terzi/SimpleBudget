export interface ProductPriceGridModel {
    productPriceId: number;
    productName: string;
    companyName: string | undefined | null;
    categoryName: string | undefined | null;
    price: number;
    priceDate: string;
    isDiscount: boolean;
    quantity: number | undefined | null;
    description: string | undefined | null;
}