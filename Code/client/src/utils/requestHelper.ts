import axios, { AxiosError, AxiosResponse } from "axios";
import { PaginatedResponse } from "../models/pagination";
import { CategoryEditModel } from "../routes/categories/models/categoryEditModel";
import { CompanyEditModel } from "../routes/companies/models/companyEditModel";
import { CurrencyEditModel } from "../routes/currencies/models/currencyEditModel";
import { CurrencyRateEditModel } from "../routes/currencies/models/currencyRateEditModel";
import { NewImportPaymentModel } from "../routes/import/models/newImportPaymentModel";
import { PaymentFilterModel } from "../routes/payments/models/paymentFilterModel";
import { PaymentModel } from "../routes/payments/models/paymentModel";
import { PlanPaymentFilterModel } from "../routes/plans/models/planPaymentFilterModel";
import { PlanPaymentModel } from "../routes/plans/models/planPaymentModel";
import { ProductPriceEditModel } from "../routes/productPrices/models/productPriceEditModel";
import { ProductPriceFilterModel } from "../routes/productPrices/models/productPriceFilterModel";
import { ProductPriceGridModel } from "../routes/productPrices/models/productPriceGridModel";
import { ProductSelectorModel } from "../routes/products/models/productSelectorModel";
import { ProductEditModel } from "../routes/products/models/productEditModel";
import { ProductGridModel } from "../routes/products/models/productGridModel";
import { router } from "../routes/Routes";
import { TaxSettingEditModel } from "../routes/taxSettings/models/taxSettingEditModel";
import { WalletEditModel } from "../routes/wallets/models/walletEditModel";
import paramHelper from "./paramHelper";
import userHelper from "./userHelper";
import { ProductPriceMultiModel } from "../routes/productPrices/models/productPriceMultiModel";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
    const token = userHelper.getUser()?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-Time-Zone-Offset"] = new Date().getTimezoneOffset();

    return config;
})

axios.interceptors.response.use(response => {
        if (process.env.NODE_ENV === "development") {
            // await (new Promise(resolve => setTimeout(resolve, 500)));
        }

        const pagination = response.headers["pagination"];

        if (pagination && !response.data?.paginationData) {
            response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        }

        return response;
    },
    (error: AxiosError) => {
        const { status } = error.response as AxiosResponse;

        switch (status) {
            case 401:
                router.navigate("/login");
                break;
        }

        return Promise.reject(error.response);
    }
)

function formDataFromValues (values: any) {
    const formData = new FormData();
    for (const key in values) {
        formData.append(key, values[key]);
    }
    return formData;
}

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(response => response.data),
    post: (url: string, body: {}) => axios.post(url, body).then(response => response.data),
    put: (url: string, body: {}) => axios.put(url, body).then(response => response.data),
    delete: (url: string) => axios.delete(url).then(response => response.data),

    postForm: (url: string, data: FormData) => axios
        .post(url, data, {
            headers: { "Content-type": "multipart/form-data" }
        })
        .then(response => response.data)
}

const Selectors = {
    getSelectors: () => requests.get("selectors"),
}

const Payments = {
    search: (filter: PaymentFilterModel) => requests.get("payments", paramHelper.getParams(filter)),
    getPayment: (id: number) => requests.get(`payments/${id}`),
    createPayment: (item: PaymentModel) => requests.post("payments", item),
    updatePayment: (id: number, item: PaymentModel) => requests.put(`payments/${id}`, item),
    deletePayment: (id: number) => requests.delete(`payments/${id}`),
    sum: (filter: PaymentFilterModel) => requests.get("payments/sum", paramHelper.getParams(filter))
}

const PlanPayments = {
    search: (filter: PlanPaymentFilterModel) => requests.get("planpayments", paramHelper.getParams(filter)),
    getPlanPayment: (id: number) => requests.get(`planpayments/${id}`),
    createPlanPayment: (item: PlanPaymentModel) => requests.post("planpayments", item),
    updatePlanPayment: (id: number, item: PlanPaymentModel) => requests.put(`planpayments/${id}`, item),
    deletePlanPayment: (id: number) => requests.delete(`planpayments/${id}`)
}

const Login = {
    login: (username: string, password: string) => requests.post("login", { username, password })
}

const Reports = {
    summary: () => requests.get("reports/summary"),
    monthly: (year?: number, month?: number) => requests.get(`reports/monthly?year=${year || ""}&month=${month || ""}`)
}

const Taxes = {
    getTaxes: (personId?: number, year?: number) => requests.get(`taxes?personId=${personId || ""}&year=${year || ""}`),
    closeYear: (personId?: number, year?: number) => requests.post(`taxes/close?personId=${personId || ""}&year=${year || ""}`, {}),
    openYear: (personId?: number, year?: number) => requests.post(`taxes/open?personId=${personId || ""}&year=${year || ""}`, {}),
}

const Categories = {
    getCategoryList: () => requests.get("categories"),
    getCategory: (id: number) => requests.get(`categories/${id}`),
    createCategory: (item: CategoryEditModel) => requests.post("categories", item),
    updateCategory: (id: number, item: CategoryEditModel) => requests.put(`categories/${id}`, item),
    deleteCategory: (id: number) => requests.delete(`categories/${id}`),
    categoryExists: (name: string, excludeId?: number) => requests.get(`categories/exists?name=${encodeURIComponent(name)}&excludeId=${excludeId || ""}`),
    getSelectorCategories: async () => await requests.get("categories/selector") as string[],
}

const Companies = {
    getCompanyList: () => requests.get("companies"),
    getCompany: (id: number) => requests.get(`companies/${id}`),
    createCompany: (item: CompanyEditModel) => requests.post("companies", item),
    updateCompany: (id: number, item: CompanyEditModel) => requests.put(`companies/${id}`, item),
    deleteCompany: (id: number) => requests.delete(`companies/${id}`),
    companyExists: (name: string, excludeId?: number) => requests.get(`companies/exists?name=${encodeURIComponent(name)}&excludeId=${excludeId || ""}`)
}

const Wallets = {
    getWalletList: () => requests.get("wallets"),
    getWallet: (id: number, includeNames: boolean) => requests.get(`wallets/${id}?includeNames=${String(includeNames).toLowerCase()}`),
    createWallet: (item: WalletEditModel) => requests.post("wallets", item),
    updateWallet: (id: number, item: WalletEditModel) => requests.put(`wallets/${id}`, item),
    deleteWallet: (id: number) => requests.delete(`wallets/${id}`),
    walletExists: (name: string, excludeId?: number) => requests.get(`wallets/exists?name=${encodeURIComponent(name)}&excludeId=${excludeId || ""}`),
    getSelectors: () => requests.get("wallets/selectors")
}

const Currencies = {
    getCurrencies: () => requests.get("currencies"),
    getCurrency: (id: number) => requests.get(`currencies/${id}`),
    createCurrency: (model: CurrencyEditModel) => requests.post("currencies", model),
    updateCurrency: (id: number, model: CurrencyEditModel) => requests.put(`currencies/${id}`, model),
    deleteCurrency: (id: number) => requests.delete(`currencies/${id}`),
    currencyExists: (code: string, excludeId?: number) => requests.get(`currencies/exists?code=${encodeURIComponent(code)}&excludeId=${excludeId || ""}`),
    getRates: (currencyId: number, page?: number) => requests.get(`currencies/${currencyId}/rates?page=${page || ""}`),
    createRate: (currencyId: number, model: CurrencyRateEditModel) => requests.post(`currencies/${currencyId}/rates`, model),
    updateRate: (currencyId: number, rateId: number, model: CurrencyRateEditModel) => requests.put(`currencies/${currencyId}/rates/${rateId}`, model),
    deleteRate: (currencyId: number, rateId: number) => requests.delete(`currencies/${currencyId}/rates/${rateId}`)
}

const TaxSettings = {
    getTaxSettings: () => requests.get("taxsettings"),
    getTaxSetting: (year: number) => requests.get(`taxsettings/${year}`),
    updateTaxSetting: (year: number, model: TaxSettingEditModel) => requests.put(`taxsettings/${year}`, model),
    deleteTaxSetting: (year: number) => requests.delete(`taxsettings/${year}`)
}

const Import = {
    uploadFile: (file: any) => requests.postForm("import/upload", formDataFromValues({ file })),
    savePayments: (wallet: string, payments: NewImportPaymentModel[]) => requests.post("import/save", { wallet, payments })
}

const Products = {
    getProducts: async () => await requests.get("products") as ProductGridModel[],
    getProduct: async (id: number) => await requests.get(`products/${id}`) as ProductEditModel,
    getSelectorProducts: async () => await requests.get("products/selector") as ProductSelectorModel[],
    createProduct: (model: ProductEditModel) => requests.post("products", model),
    updateProduct: (id: number, model: ProductEditModel) => requests.put(`products/${id}`, model),
    deleteProduct: (id: number) => requests.delete(`products/${id}`),
    productExists: async (name: string, excludeId?: number) => await requests.get(`products/exists?name=${encodeURIComponent(name)}&excludeId=${excludeId || ""}`) as boolean
}

const ProductPrices = {
    search: async (filter: ProductPriceFilterModel) => await requests.get("productprices", paramHelper.getParams(filter)) as PaginatedResponse<ProductPriceGridModel>,
    getProductPrice: async (id: number) => await requests.get(`productprices/${id}`) as ProductPriceEditModel,
    createProductPrice: async (model: ProductPriceEditModel) => await requests.post("productprices", model) as number,
    createProductPriceMulti: async (model: ProductPriceMultiModel) => await requests.post("productprices/multi", model) as number[],
    updateProductPrice: (id: number, model: ProductPriceEditModel) => requests.put(`productprices/${id}`, model),
    deleteProductPrice: (id: number) => requests.delete(`productprices/${id}`),
}

const requestHelper = {
    Selectors,
    Payments,
    PlanPayments,
    Login,
    Reports,
    Taxes,
    Categories,
    Companies,
    Wallets,
    Currencies,
    TaxSettings,
    Import,
    Products,
    ProductPrices
}

export default requestHelper