export interface ProductPriceMultiFormValues {
    companyName: string;
    categoryName: string;
    priceDate: string;
    prices: {
        productName: string;
        quantity: string;
        price: string;
        isDiscount: boolean;
        description: string;
    }[]
}