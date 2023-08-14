import { PaymentFilterModel } from "../models/paymentFilterModel";

const paymentFilterHelper = {
    getPaymentFilter: (input: URLSearchParams): PaymentFilterModel => {
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

    getPaymentFilterParams: (filter?: PaymentFilterModel, includeId = false, includePage = true) => {
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

    getPaymentsUrl: (filter?: PaymentFilterModel, id?: number) => {
        if (id && isNaN(id)) {
            id = undefined;
        }

        if (!filter && !id) return "/payments";

        if (id) {
            filter = { ...filter, id: id };
        }

        let filterParams = paymentFilterHelper.getPaymentFilterParams(filter, !!id);
        filterParams = filterParams ? "?" + filterParams : "";

        return `/payments${filterParams}`;
    },

    isSimpleFilter: (text?: string) => {
        if (!text || text.length === 0) {
            return true;
        }

        try {
            JSON.parse(text);
        } catch (SyntaxError) {
            return true;
        }

        return false;
    }
}

export default paymentFilterHelper;