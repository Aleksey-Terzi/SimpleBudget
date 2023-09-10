export interface ProductPriceGridModel {
    productPriceId: number;
    productName: string;
    companyName?: string;
    categoryName?: string;
    price: number;
    priceDate: string;
    isDiscount: boolean;
    description?: string;
    quantity?: number;
}