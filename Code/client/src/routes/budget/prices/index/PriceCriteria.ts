import { ProductPriceFilterModel } from "@/api/models/ProductPriceFilterModel";

export interface PriceCriteria {
    id: number | null;
    keyword: string;
}

export function priceCriteriaToFilter(
    pageIndex: number,
    filter: PriceCriteria,
    ignoreId: boolean
) : ProductPriceFilterModel
{
    return {
        id: ignoreId ? null : filter.id ?? null,
        page: ignoreId || !filter.id ? pageIndex + 1 : null,
        keyword: filter.keyword,
    };
}