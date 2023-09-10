export interface ProductPriceEditModel {
    productName: string;
    companyName?: string;
    categoryName?: string;
    priceDate: string;
    price: number;
    isDiscount: boolean;
    quantity?: number;
    description?: string;
}