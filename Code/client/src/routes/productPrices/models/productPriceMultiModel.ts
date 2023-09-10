export interface ProductPriceMultiModel {
    companyName?: string;
    categoryName?: string;
    priceDate: string;
    prices: {
        productName: string;
        quantity?: number;
        price: number;
        isDiscount: boolean;
        description?: string;
    }[]
}