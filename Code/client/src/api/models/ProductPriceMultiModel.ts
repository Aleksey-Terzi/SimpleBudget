interface PriceModel
{
    productName: string;
    quantity: number;
    price: number;
    isDiscount: boolean;
    description: string | undefined | null;
}

export interface ProductPriceMultiModel {
    companyName: string | undefined | null;
    categoryName: string | undefined | null;
    priceDate: string;
    prices: PriceModel[];
}
