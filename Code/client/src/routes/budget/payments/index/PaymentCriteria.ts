import { PaymentFilterModel } from "@/api/models/PaymentFilterModel";
import { apiDateFormatType } from "@/api/restClient";
import { dateHelper } from "@/helpers/date/dateHelper";
import { DateParts, InvalidDate } from "@/helpers/date/dateTypes";
import { numberHelper } from "@/helpers/numberHelper";
import { objectHelper } from "@/helpers/objectHelper";

export interface PaymentCriteria {
    id: number | null;
    type: "expenses" | "income" | "transfer" | null;
    dateFrom: DateParts | InvalidDate | null;
    dateThru: DateParts | InvalidDate | null;
    amountFrom: number | null;
    amountThru: number | null;
    keyword: string | null;
    company: string | null;
    category: string | null;
    wallet: string | null;
    textQuery: string | null;
}

export const defaultPaymentCriteria: PaymentCriteria = {
    id: null,
    type: null,
    dateFrom: null,
    dateThru: null,
    amountFrom: null,
    amountThru: null,
    keyword: null,
    company: null,
    category: null,
    wallet: null,
    textQuery: null,
};

export function createPaymentCriteria(year: number, month: number, categoryName: string) {
    return {
        id: null,
        type: "expenses",
        dateFrom: null,
        dateThru: null,
        amountFrom: null,
        amountThru: null,
        keyword: null,
        company: null,
        category: null,
        wallet: null,
        textQuery: `year:${year} month:${month} category:"${categoryName}"`
    }
}

export function paymentCriteriaToFilter(
    pageIndex: number,
    criteria: PaymentCriteria,
    ignoreId: boolean
) : PaymentFilterModel
{
    return {
        id: ignoreId ? null : criteria.id,
        page: ignoreId || !criteria.id ? pageIndex + 1 : null,
        text: criteria.textQuery
            ? criteria.textQuery
            : JSON.stringify(objectHelper.deleteEmptyProps({
                startDate: dateHelper.format(criteria.dateFrom, apiDateFormatType),
                endDate: dateHelper.format(criteria.dateThru, apiDateFormatType),
                startValue: numberHelper.toServerDecimal(criteria.amountFrom),
                endValue: numberHelper.toServerDecimal(criteria.amountThru),
                keyword: criteria.keyword,
                company: criteria.company,
                category: criteria.category,
                wallet: criteria.wallet
            })),
        type: criteria.type,
    };
}