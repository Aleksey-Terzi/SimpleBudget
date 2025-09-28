import { PlanPaymentFilterModel } from "@/api/models/PlanPaymentFilterModel";

export interface PlanCriteria {
    id: number | null;
    keyword: string | null;
}

export function planCriteriaToFilter(
    pageIndex: number,
    criteria: PlanCriteria,
    ignoreId: boolean
) : PlanPaymentFilterModel
{
    return {
        id: ignoreId ? null : criteria.id,
        page: ignoreId || !criteria.id ? pageIndex + 1 : null,
        text: criteria.keyword,
        type: null,
    };
}