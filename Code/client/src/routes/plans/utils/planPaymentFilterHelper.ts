import { PlanPaymentFilterModel } from "../models/planPaymentFilterModel";

const planPaymentFilterHelper = {
    getPlanPaymentFilter: (input: URLSearchParams): PlanPaymentFilterModel => {
        const id: number | undefined = parseInt(input.get("id") || "");
        const page: number | undefined = parseInt(input.get("page") || "");
        const text = input.get("text");
        const type = input.get("type");

        return {
            id: !isNaN(id) ? id : undefined,
            page: !isNaN(page) ? page : undefined,
            text: text || undefined,
            type: type || undefined
        }
    },

    getPlanPaymentFilterParams: (filter?: PlanPaymentFilterModel, includeId = false, includePage = true) => {
        if (!filter) {
            return undefined;
        }

        let filterParams: string | undefined = "";

        if (includeId && filter.id) {
            filterParams += "&id=" + filter.id;
        }

        if (includePage && filter.page) {
            filterParams += "&page=" + filter.page;
        }

        if (filter.text) {
            filterParams += "&text=" + encodeURIComponent(filter.text);
        }

        if (filter.type) {
            filterParams += "&type=" + encodeURIComponent(filter.type);
        }

        return filterParams.length > 0 ? filterParams.substring(1) : undefined;
    },

    getPlanPaymentsUrl: (filter?: PlanPaymentFilterModel, id?: number) => {
        if (id && isNaN(id)) {
            id = undefined;
        }

        if (!filter && !id) return "/planpayments";

        if (id) {
            filter = { ...filter, id: id };
        }

        let filterParams = planPaymentFilterHelper.getPlanPaymentFilterParams(filter, !!id);
        filterParams = filterParams ? "?" + filterParams : "";

        return `/planpayments${filterParams}`;
    }
}

export default planPaymentFilterHelper;