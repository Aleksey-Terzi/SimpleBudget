export interface ProductPriceEditModel {
    productName: string;
    companyName: string | undefined | null;
    categoryName: string | undefined | null;
    priceDate: string;
    price: number;
    isDiscount: boolean;
    quantity: number | undefined | null;
    description: string | undefined | null;
}