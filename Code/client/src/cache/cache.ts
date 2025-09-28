import { _reportCache } from "./_reportCache";
import { _searchCache } from "./_searchCache";
import { _selectorCache } from "./_selectorCache";
import { _dictionaryCache } from "./_dictionaryCache";
import { DictionaryStorageKey } from "@/helpers/enums";
import { _walletSelectorCache } from "./_walletSelectorCache";

export const cache = {
    selector: _selectorCache,
    walletSelector: _walletSelectorCache,
    search: _searchCache,
    report: _reportCache,
    dictionary: _dictionaryCache,

    onPaymentChanged(
        paymentId: number | null,
        categoryName?: string | null | string[],
        companyName?: string | null | string[],
    ) {
        const paymentSearch = this.search.get<object, object>("payment");
        const newSearchData =  paymentSearch.data
            ? {
                ...paymentSearch.data,
                rows: null,
                criteria: {...paymentSearch.data.criteria, id: paymentId},
            } : {
                pageIndex: 0,
                criteria: { id: paymentId },
                rows: null,
                totalRowCount: 0,
                rowsPerPage: 0,
                pagesPerView: 0,
            };
        this.search.setData("payment", newSearchData);

        const paymentSearch2 = this.search.get<object, object>("monthly-report-payment");
        if (paymentSearch2.data) {
            this.search.setData("monthly-report-payment", {
                ...paymentSearch2.data,
                rows: null,
            });
        }

        this.selector.refreshIfCategoryNotExist(categoryName);
        this.selector.refreshIfCompanyNotExist(companyName);

        this.report.delete("summary");
        this.report.delete("monthly");
    },

    onPlanChanged(
        planId: number | null,
        categoryName?: string | null | string[],
        companyName?: string | null | string[],
    ) {
        const planSearch = this.search.get<object, object>("plan");
        const newSearchData =  planSearch.data
            ? {
                ...planSearch.data,
                rows: null,
                criteria: {...planSearch.data.criteria, id: planId},
            } : {
                pageIndex: 0,
                criteria: { id: planId },
                rows: null,
                totalRowCount: 0,
                rowsPerPage: 0,
                pagesPerView: 0,
            };
        this.search.setData("plan", newSearchData);

        this.selector.refreshIfCategoryNotExist(categoryName);
        this.selector.refreshIfCompanyNotExist(companyName);
    },

    onPriceChanged(
        priceId: number | null,
        productName?: string | null | string[],
        categoryName?: string | null | string[],
        companyName?: string | null | string[],
    ) {
        const priceSearch = this.search.get<object, object>("price");
        const newSearchData =  priceSearch.data
            ? {
                ...priceSearch.data,
                rows: null,
                criteria: {...priceSearch.data.criteria, id: priceId},
            } : {
                pageIndex: 0,
                criteria: { id: priceId },
                rows: null,
                totalRowCount: 0,
                rowsPerPage: 0,
                pagesPerView: 0,
            };
        this.search.setData("price", newSearchData);

        this.selector.refreshIfProductNotExist(productName);
        this.selector.refreshIfCategoryNotExist(categoryName);
        this.selector.refreshIfCompanyNotExist(companyName);
    },

    onDictionaryChanged(storageKey: DictionaryStorageKey) {
        this.dictionary.delete(storageKey);

        if (storageKey === "currencies") {
            this.walletSelector.refresh();
        }
    },
}