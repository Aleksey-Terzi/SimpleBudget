import { WalletGridModel } from "./models/WalletGridModel";
import { CategoryGridModel } from "./models/CategoryGridModel";
import { CategoryEditModel } from "./models/CategoryEditModel";
import { CompanyGridModel } from "./models/CompanyGridModel";
import { CompanyEditModel } from "./models/CompanyEditModel";
import { CurrencyGridModel } from "./models/CurrencyGridModel";
import { CurrencyEditModel } from "./models/CurrencyEditModel";
import { CurrencyRateGridModel } from "./models/CurrencyRateGridModel";
import { CurrencyRateEditModel } from "./models/CurrencyRateEditModel";
import { fetchHelper } from "./fetchHelper";
import { PaymentFilterModel } from "./models/PaymentFilterModel";
import { PaymentGridItemModel } from "./models/PaymentGridItemModel";
import { PaymentSumModel } from "./models/PaymentSumModel";
import { PaymentEditItemModel } from "./models/PaymentEditItemModel";
import { PlanPaymentFilterModel } from "./models/PlanPaymentFilterModel";
import { PlanPaymentGridItemModel } from "./models/PlanPaymentGridItemModel";
import { PlanPaymentEditItemModel } from "./models/PlanPaymentEditItemModel";
import { ProductPriceFilterModel } from "./models/ProductPriceFilterModel";
import { ProductPriceSearchResult } from "./models/ProductPriceSearchResult";
import { ProductPriceEditModel } from "./models/ProductPriceEditModel";
import { ProductPriceMultiModel } from "./models/ProductPriceMultiModel";
import { ProductSelectorModel } from "./models/ProductSelectorModel";
import { ProductGridModel } from "./models/ProductGridModel";
import { ProductEditModel } from "./models/ProductEditModel";
import { SummaryModel } from "./models/SummaryModel";
import { MonthlyModel } from "./models/MonthlyModel";
import { SelectorsModel } from "./models/SelectorsModel";
import { TaxModel } from "./models/TaxModel";
import { TaxSettingModel } from "./models/TaxSettingModel";
import { TaxSettingEditModel } from "./models/TaxSettingEditModel";
import { WalletEditModel } from "./models/WalletEditModel";
import { WalletSelectorsModel } from "./models/WalletSelectorsModel";
import { FormatType } from "@/helpers/date/dateTypes";
import { ImportModel } from "./models/ImportModel";
import { NewImportModel } from "./models/NewImportModel";

export const apiDateFormatType: FormatType = "yyyy-mm-dd";

export const restClient = {
    async login(username: string, password: string) {
        const result = await fetchHelper.post<{ token: string }>("/login", {
            username,
            password
        });
        fetchHelper.setToken(result.token);
        fetchHelper.setUsername(username);
        return result;
    },
    logout() {
        fetchHelper.setToken(null);
    },

    categories: {
        async selector() {
            return await fetchHelper.get<string[]>("/categories/selector")
        },
        async all() {
            return await fetchHelper.get<CategoryGridModel[]>("/categories");
        },
        async get(categoryId: number) {
            return await fetchHelper.get<CategoryEditModel>(`/categories/${categoryId}`);
        },
        async exists(name: string, excludeId: number | null) {
            return await fetchHelper.get<boolean>(`/categories/exists`, [
                { name: "name", value: name },
                { name: "excludeId", value: excludeId !== null ? String(excludeId) : null },
            ]);
        },
        async create(name: string) {
            return await fetchHelper.post<number>("/categories", { name });
        },
        async update(categoryId: number, name: string) {
            await fetchHelper.put(`/categories/${categoryId}`, { name });
        },
        async del(categoryId: number) {
            await fetchHelper.del(`/categories/${categoryId}`);
        },
    },

    companies: {
        async all() {
            return await fetchHelper.get<CompanyGridModel[]>("/companies");
        },
        async get(companyId: number) {
            return await fetchHelper.get<CompanyEditModel>(`/companies/${companyId}`);
        },
        async exists(name: string, excludeId: number | null) {
            return await fetchHelper.get<boolean>(`/companies/exists`, [
                { name: "name", value: name },
                { name: "excludeId", value: excludeId !== null ? String(excludeId) : null },
            ]);
        },
        async create(name: string) {
            return await fetchHelper.post<number>("/companies", { name });
        },
        async update(companyId: number, name: string) {
            await fetchHelper.put(`/companies/${companyId}`, { name });
        },
        async del(companyId: number) {
            await fetchHelper.del(`/companies/${companyId}`);
        },
    },

    currencies: {
        async all() {
            return await fetchHelper.get<CurrencyGridModel[]>("/currencies");
        },
        async get(currencyId: number) {
            return await fetchHelper.get<CurrencyEditModel>(`/currencies/${currencyId}`);
        },
        async exists(code: string, excludeId: number | null) {
            return await fetchHelper.get<boolean>(`/currencies/exists`, [
                { name: "code", value: code },
                { name: "excludeId", value: excludeId !== null ? String(excludeId) : null },
            ]);
        },
        async create(model: CurrencyEditModel) {
            return await fetchHelper.post<number>("/currencies", model);
        },
        async update(currencyId: number, model: CurrencyEditModel) {
            await fetchHelper.put(`/currencies/${currencyId}`, model);
        },
        async del(currencyId: number) {
            await fetchHelper.del(`/currencies/${currencyId}`);
        },
    },

    rates: {
        async all(currencyId: number, rateId: number | null, page: number | null) {
            return await fetchHelper.getWithPagination<CurrencyRateGridModel[]>(`/currencies/${currencyId}/rates`, [
                { name: "rateId", value: rateId !== null ? String(rateId) : null },
                { name: "page", value: page !== null ? String(page) : null },
            ]);
        },
        async create(currencyId: number, model: CurrencyRateEditModel) {
            return await fetchHelper.postWithPagination<CurrencyRateGridModel[]>(`/currencies/${currencyId}/rates`, model);
        },
        async update(currencyId: number, rateId: number, model: CurrencyRateEditModel) {
            return await fetchHelper.putWithPagination<CurrencyRateGridModel[]>(`/currencies/${currencyId}/rates/${rateId}`, model);
        },
        async del(currencyId: number, rateId: number) {
            return await fetchHelper.delWithPagination<CurrencyRateGridModel[]>(`/currencies/${currencyId}/rates/${rateId}`);
        },
    },

    payments: {
        async search(filter: PaymentFilterModel) {
            return await fetchHelper.getWithPagination<PaymentGridItemModel[]>("/payments", filterToParams(filter));
        },
        async sum(filter: PaymentFilterModel) {
            return await fetchHelper.get<PaymentSumModel>("/payments/sum", filterToParams(filter));
        },
        async get(paymentId: number) {
            return await fetchHelper.get<PaymentEditItemModel>(`/payments/${paymentId}`);
        },
        async create(model: PaymentEditItemModel) {
            return await fetchHelper.post<number>("/payments", model);
        },
        async update(paymentId: number, model: PaymentEditItemModel) {
            await fetchHelper.put(`/payments/${paymentId}`, model);
        },
        async del(paymentId: number) {
            await fetchHelper.del(`/payments/${paymentId}`);
        },
    },

    planPayments: {
        async search(filter: PlanPaymentFilterModel) {
            return await fetchHelper.getWithPagination<PlanPaymentGridItemModel[]>("/planpayments", filterToParams(filter));
        },
        async get(planPaymentId: number) {
            return await fetchHelper.get<PlanPaymentEditItemModel>(`/planpayments/${planPaymentId}`);
        },
        async create(model: PlanPaymentEditItemModel) {
            return await fetchHelper.post<number>("/planpayments", model);
        },
        async update(planPaymentId: number, model: PlanPaymentEditItemModel) {
            await fetchHelper.put(`/planpayments/${planPaymentId}`, model);
        },
        async del(planPaymentId: number) {
            await fetchHelper.del(`/planpayments/${planPaymentId}`);
        },
    },

    productPrices: {
        async search(filter: ProductPriceFilterModel) {
            return await fetchHelper.getWithPagination<ProductPriceSearchResult>("/productprices", productPriceFilterToParams(filter));
        },
        async get(productPriceId: number) {
            return await fetchHelper.get<ProductPriceEditModel>(`/productprices/${productPriceId}`);
        },
        async create(model: ProductPriceEditModel) {
            return await fetchHelper.post<number>("/productprices", model);
        },
        async createMulti(model: ProductPriceMultiModel) {
            return await fetchHelper.post<number>("/productprices/multi", model);
        },
        async update(productPriceId: number, model: ProductPriceEditModel) {
            await fetchHelper.put(`/productprices/${productPriceId}`, model);
        },
        async del(productPriceId: number) {
            await fetchHelper.del(`/productprices/${productPriceId}`);
        },
    },

    products: {
        async selector() {
            return await fetchHelper.get<ProductSelectorModel[]>("/products/selector")
        },
        async all() {
            return await fetchHelper.get<ProductGridModel[]>("/products");
        },
        async get(productId: number) {
            return await fetchHelper.get<ProductEditModel>(`/products/${productId}`);
        },
        async exists(name: string, excludeId: number | null) {
            return await fetchHelper.get<boolean>(`/products/exists`, [
                { name: "name", value: name },
                { name: "excludeId", value: excludeId !== null ? String(excludeId) : null },
            ]);
        },
        async create(productName: string, categoryName: string | null) {
            return await fetchHelper.post<number>("/products", {
                productName,
                categoryName,
                priceCount: 0,
            });
        },
        async update(productId: number, productName: string, categoryName: string | null) {
            await fetchHelper.put(`/products/${productId}`, {
                productName,
                categoryName,
                priceCount: 0,
            });
        },
        async del(productId: number) {
            await fetchHelper.del(`/products/${productId}`);
        },
    },

    reports: {
        async summary() {
            return await fetchHelper.get<SummaryModel>("/reports/summary")
        },
        async monthly(year: number | null, month: number | null) {
            return await fetchHelper.get<MonthlyModel>(`/reports/monthly`, [
                { name: "year", value: year !== null ? String(year) : null },
                { name: "month", value: month !== null ? String(month) : null },
            ]);
        },
    },

    selectors: {
        async all() {
            return await fetchHelper.get<SelectorsModel>("/selectors");
        },
    },

    taxes: {
        async search(personId: number | null, year: number | null) {
            return await fetchHelper.get<TaxModel>("/taxes", [
                { name: "personId", value: personId !== null ? String(personId): null },
                { name: "year", value: year !== null ? String(year): null },
            ]);
        },
        async close(personId: number | null, year: number | null) {
            return await fetchHelper.post<TaxModel>("/taxes/close", {}, [
                { name: "personId", value: personId !== null ? String(personId): null },
                { name: "year", value: year !== null ? String(year): null },
            ]);
        },
        async open(personId: number | null, year: number | null) {
            return await fetchHelper.post<TaxModel>("/taxes/open", {}, [
                { name: "personId", value: personId !== null ? String(personId): null },
                { name: "year", value: year !== null ? String(year): null },
            ]);
        },
    },

    taxSettings: {
        async all() {
            return await fetchHelper.get<TaxSettingModel>("/taxsettings");
        },
        async get(year: number) {
            return await fetchHelper.get<TaxSettingEditModel>(`/taxsettings/${year}`);
        },
        async update(year: number, model: TaxSettingEditModel) {
            await fetchHelper.put(`/taxsettings/${year}`, model);
        },
        async del(year: number) {
            await fetchHelper.del(`/taxsettings/${year}`);
        },
    },
    
    wallets: {
        async all() {
            return await fetchHelper.get<WalletGridModel[]>("/wallets");
        },
        async get(walletId: number, includeNames: boolean) {
            return await fetchHelper.get<WalletEditModel>(`/wallets/${walletId}`, [{ name: "includeNames", value: String(includeNames) }]);
        },
        async selectors() {
            return await fetchHelper.get<WalletSelectorsModel>("/wallets/selectors")
        },
        async exists(name: string, excludeId: number | null) {
            return await fetchHelper.get<boolean>(`/wallets/exists`, [
                { name: "name", value: name },
                { name: "excludeId", value: excludeId !== null ? String(excludeId) : null },
            ]);
        },
        async create(walletName: string, personId: number | null, currencyId: number) {
            return await fetchHelper.post<number>("/wallets", {
                personId,
                currencyId,
                walletName,
                paymentCount: 0,
            });
        },
        async update(walletId: number, walletName: string, personId: number | null, currencyId: number) {
            await fetchHelper.put(`/wallets/${walletId}`, {
                personId,
                currencyId,
                walletName,
                paymentCount: 0,
            });
        },
        async del(walletId: number) {
            await fetchHelper.del(`/wallets/${walletId}`);
        },
    },

    import: {
        async upload(file: File) {
            return fetchHelper.post<ImportModel>("/import/upload", formDataFromFile(file));
        },
        async save(model: NewImportModel) {
            return fetchHelper.post<number[]>("/import/save", model);
        }
    }
};

function filterToParams({ id, page, text, type }: PaymentFilterModel) {
    return [
        { name: "id", value: id !== null ? String(id) : null },
        { name: "page", value: page !== null ? String(page) : null },
        { name: "text", value: text },
        { name: "type", value: type },
    ];
}

function productPriceFilterToParams({ id, page, keyword }: ProductPriceFilterModel) {
    return [
        { name: "id", value: id !== null ? String(id) : null },
        { name: "page", value: page !== null ? String(page) : null },
        { name: "keyword", value: keyword },
    ];
}

function formDataFromFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
}