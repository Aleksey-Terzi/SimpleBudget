import { ProductPriceFilterModel } from "../models/productPriceFilterModel";

const productPriceFilterHelper = {
    getFilter: (input: URLSearchParams): ProductPriceFilterModel => {
        const id = parseInt(input.get("id") || "");
        const page = parseInt(input.get("page") || "");
        const keyword = input.get("keyword");

        return {
            id: !isNaN(id) ? id : undefined,
            page: !isNaN(page) ? page : undefined,
            keyword: keyword || undefined
        }
    },

    getFilterParams: (filter?: ProductPriceFilterModel, includeId = false, includePage = true) => {
        if (!filter) {
            return undefined;
        }

        let filterParams = "";

        if (includeId && filter.id) {
            filterParams += "&id=" + filter.id;
        }

        if (includePage && filter.page) {
            filterParams += "&page=" + filter.page;
        }

        if (filter.keyword) {
            filterParams += "&keyword=" + encodeURIComponent(filter.keyword);
        }

        return filterParams.length > 0 ? filterParams.substring(1) : undefined;
    },

    getProductPricesUrl: (filter?: ProductPriceFilterModel, id?: number) => {
        if (id && isNaN(id)) {
            id = undefined;
        }

        if (!filter && !id) return "/productprices";

        if (id) {
            filter = { ...filter, id: id };
        }

        let filterParams = productPriceFilterHelper.getFilterParams(filter, !!id);
        filterParams = filterParams ? "?" + filterParams : "";

        return `/productprices${filterParams}`;
    },
}

export default productPriceFilterHelper;