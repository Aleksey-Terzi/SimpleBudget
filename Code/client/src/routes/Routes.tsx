import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import PaymentEdit from "./payments/PaymentEdit";
import PaymentDelete from "./payments/PaymentDelete";
import Payments from "./payments/Payments";

import PlanPaymentEdit from "./plans/PlanPaymentEdit";
import PlanPaymentDelete from "./plans/PlanPaymentDelete";
import PlanPayments from "./plans/PlanPayments";

import Login from "./login/Login";
import Summary from "./reports/Summary";
import Monthly from "./reports/Monthly";
import Tax from "./taxes/Taxes";
import Categories from "./categories/Categories";
import CategoryEdit from "./categories/CategoryEdit";
import CategoryDelete from "./categories/CategoryDelete";
import Dictionaries from "./dictionaries/Dictionaries";
import Companies from "./companies/Companies";
import CompanyEdit from "./companies/CompanyEdit";
import CompanyDelete from "./companies/CompanyDelete";
import Wallets from "./wallets/Wallets";
import WalletEdit from "./wallets/WalletEdit";
import WalletDelete from "./wallets/WalletDelete";
import Currencies from "./currencies/Currencies";
import CurrencyEdit from "./currencies/CurrencyEdit";
import CurrencyDelete from "./currencies/CurrencyDelete";
import TaxSettings from "./taxSettings/TaxSettings";
import TaxSettingEdit from "./taxSettings/TaxSettingEdit";
import Import from "./import/Import";
import Products from "./products/Products";
import ProductEdit from "./products/ProductEdit";
import ProductDelete from "./products/ProductDelete";
import ProductPrices from "./productPrices/ProductPrices";
import ProductPriceEdit from "./productPrices/ProductPriceEdit";
import ProductPriceDelete from "./productPrices/ProductPriceDelete";
import ProductPriceMultiAdd from "./productPrices/ProductPriceMultiAdd";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/payments", element: <Payments /> },
            { path: "/payments/add", element: <PaymentEdit /> },
            { path: "/payments/:id", element: <PaymentEdit /> },
            { path: "/payments/:id/delete", element: <PaymentDelete /> },
            { path: "/payments/import", element: <Import /> },

            { path: "/planpayments", element: <PlanPayments /> },
            { path: "/planpayments/add", element: <PlanPaymentEdit /> },
            { path: "/planpayments/:id", element: <PlanPaymentEdit /> },
            { path: "/planpayments/:id/delete", element: <PlanPaymentDelete /> },

            { path: "/reports/summary", element: <Summary /> },
            { path: "/reports/monthly", element: <Monthly /> },

            { path: "/taxes", element: <Tax /> },

            { path: "/dictionaries", element: <Dictionaries /> },

            { path: "/categories", element: <Categories /> },
            { path: "/categories/add", element: <CategoryEdit /> },
            { path: "/categories/:id", element: <CategoryEdit /> },
            { path: "/categories/:id/delete", element: <CategoryDelete /> },

            { path: "/companies", element: <Companies /> },
            { path: "/companies/add", element: <CompanyEdit /> },
            { path: "/companies/:id", element: <CompanyEdit /> },
            { path: "/companies/:id/delete", element: <CompanyDelete /> },

            { path: "/wallets", element: <Wallets /> },
            { path: "/wallets/add", element: <WalletEdit /> },
            { path: "/wallets/:id", element: <WalletEdit /> },
            { path: "/wallets/:id/delete", element: <WalletDelete /> },

            { path: "/currencies", element: <Currencies /> },
            { path: "/currencies/add", element: <CurrencyEdit /> },
            { path: "/currencies/:id", element: <CurrencyEdit /> },
            { path: "/currencies/:id/delete", element: <CurrencyDelete /> },

            { path: "/products", element: <Products /> },
            { path: "/products/add", element: <ProductEdit /> },
            { path: "/products/:id", element: <ProductEdit /> },
            { path: "/products/:id/delete", element: <ProductDelete /> },

            { path: "/productprices", element: <ProductPrices /> },
            { path: "/productprices/add", element: <ProductPriceEdit /> },
            { path: "/productprices/addmulti", element: <ProductPriceMultiAdd /> },
            { path: "/productprices/:id", element: <ProductPriceEdit /> },
            { path: "/productprices/:id/delete", element: <ProductPriceDelete /> },

            { path: "/taxsettings", element: <TaxSettings /> },
            { path: "/taxsettings/:year", element: <TaxSettingEdit /> },
        ]
    },
    {
        path: "/login",
        element: <Login />
    }
])