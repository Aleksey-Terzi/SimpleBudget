import { ReactNode } from "react";
import { IconType } from "@/components/Icon";
import TestIndex from "./test/index/TestIndex";
import PaymentSearch from "./budget/payments/index/PaymentSearch";
import PaymentNew from "./budget/payments/new/PaymentNew";
import PaymentEdit from "./budget/payments/edit/PaymentEdit";
import PaymentDelete from "./budget/payments/delete/PaymentDelete";
import PaymentImport from "./budget/payments/import/PaymentImport";
import SummaryReport from "./reports/summary/SummaryReport";
import MonthlyReport from "./reports/monthly/MonthlyReport";
import PriceSearch from "./budget/prices/index/PriceSearch";
import PriceNew from "./budget/prices/new/PriceNew";
import PriceEdit from "./budget/prices/edit/PriceEdit";
import PriceDelete from "./budget/prices/delete/PriceDelete";
import PlanSearch from "./budget/plans/index/PlanSearch";
import PlanNew from "./budget/plans/new/PlanNew";
import PlanEdit from "./budget/plans/edit/PlanEdit";
import PlanDelete from "./budget/plans/delete/PlanDelete";
import Taxes from "./budget/taxes/index/Taxes";
import TaxSearch from "./dictionary/taxes/index/TaxSearch";
import TaxEdit from "./dictionary/taxes/edit/TaxEdit";
import CurrencySearch from "./dictionary/currencies/index/CurrencySearch";
import CurrencyNew from "./dictionary/currencies/new/CurrencyNew";
import CurrencyEdit from "./dictionary/currencies/edit/CurrencyEdit";
import CurrencyDelete from "./dictionary/currencies/delete/CurrencyDelete";
import CategorySearch from "./dictionary/categories/index/CategorySearch";
import CategoryNew from "./dictionary/categories/new/CategoryNew";
import CategoryEdit from "./dictionary/categories/edit/CategoryEdit";
import CategoryDelete from "./dictionary/categories/delete/CategoryDelete";
import CompanySearch from "./dictionary/companies/index/CompanySearch";
import CompanyNew from "./dictionary/companies/new/CompanyNew";
import CompanyEdit from "./dictionary/companies/edit/CompanyEdit";
import CompanyDelete from "./dictionary/companies/delete/CompanyDelete";
import ProductSearch from "./dictionary/products/index/ProductSearch";
import ProductNew from "./dictionary/products/new/ProductNew";
import ProductEdit from "./dictionary/products/edit/ProductEdit";
import ProductDelete from "./dictionary/products/delete/ProductDelete";
import WalletSearch from "./dictionary/wallets/index/WalletSearch";
import WalletNew from "./dictionary/wallets/new/WalletNew";
import WalletEdit from "./dictionary/wallets/edit/WalletEdit";
import WalletDelete from "./dictionary/wallets/delete/WalletDelete";

export interface MenuItem {
    url?: string;
    text: string;
    icon: IconType;
    onClick?: () => unknown;
}

export interface FormRoute {
    parent?: FormRoute;
    title: string;
    category?: string;
    path: string;
    element: ReactNode;
    menu?: MenuItem[];
    children?: FormRoute[] | null;
}

export const formRoutes: FormRoute[] = [
    {
        title: "Payments",
        category: "Budget",
        path: "/budget/payments",
        element: <PaymentSearch key="/budget/payments" storageKey="payment" allowFiltering={true} />,
        menu: [
            { url: "/budget/payments/new", text: "Add New Payment", icon: "plus-cricle" },
            { url: "/budget/payments/import", text: "Import Payments", icon: "arrow-up-tray" },
        ],
        children: [
            {
                title: "New",
                path: "/budget/payments/new",
                element: <PaymentNew />,
            },
            {
                title: "Edit",
                path: "/budget/payments/:id",
                element: <PaymentEdit />,
                menu: [
                    { url: "/budget/payments/:id/edit/delete", text: "Delete Payment", icon: "trash" },
                ],
                children: [
                    {
                        title: "Delete",
                        path: "/budget/payments/:id/edit/delete",
                        element: <PaymentDelete />,
                    }
                ]
            },
            {
                title: "Delete",
                path: "/budget/payments/:id/delete",
                element: <PaymentDelete />,
            },
            {
                title: "Import",
                path: "/budget/payments/import",
                element: <PaymentImport />,
            },
        ]
    },
    {
        title: "Prices",
        category: "Budget",
        path: "/budget/prices",
        element: <PriceSearch />,
        menu: [
            { url: "/budget/prices/new", text: "Add New Price", icon: "plus-cricle" },
        ],
        children: [
            {
                title: "New",
                path: "/budget/prices/new",
                element: <PriceNew />,
            },
            {
                title: "Edit",
                path: "/budget/prices/:id",
                element: <PriceEdit />,
                menu: [
                    { url: "/budget/prices/:id/edit/delete", text: "Delete Price", icon: "trash" },
                ],
                children: [
                    {
                        title: "Delete",
                        path: "/budget/prices/:id/edit/delete",
                        element: <PriceDelete />,
                    }
                ]
            },
            {
                title: "Delete",
                path: "/budget/prices/:id/delete",
                element: <PriceDelete />,
            },
        ],
    },
    {
        title: "Plans",
        category: "Budget",
        path: "/budget/plans",
        element: <PlanSearch />,
        menu: [
            { url: "/budget/plans/new", text: "Add New Plan", icon: "plus-cricle" },
        ],
        children: [
            {
                title: "New",
                path: "/budget/plans/new",
                element: <PlanNew />,
            },
            {
                title: "Edit",
                path: "/budget/plans/:id",
                element: <PlanEdit />,
                menu: [
                    { url: "/budget/plans/:id/edit/delete", text: "Delete Plan", icon: "trash" },
                ],
                children: [
                    {
                        title: "Delete",
                        path: "/budget/plans/:id/edit/delete",
                        element: <PlanDelete />,
                    }
                ]
            },
            {
                title: "Delete",
                path: "/budget/plans/:id/delete",
                element: <PlanDelete />,
            },
        ]
    },
    {
        title: "Taxes",
        category: "Budget",
        path: "/budget/taxes",
        element: <Taxes />,
    },
    {
        title: "Summary",
        category: "Reports",
        path: "/report/summary",
        element: <SummaryReport />,
    },
    {
        title: "Monthly Report",
        category: "Reports",
        path: "/report/monthly-report",
        element: <MonthlyReport />,
        children: [
            {
                title: "Payments",
                path: "/report/monthly-report/payments",
                element: <PaymentSearch key="/report/monthly-report/payments" storageKey="monthly-report-payment" allowFiltering={false} />,
                children: [
                    {
                        title: "Edit",
                        path: "/report/monthly-report/payments/:id",
                        element: <PaymentEdit />,
                    },
                    {
                        title: "Delete",
                        path: "/report/monthly-report/payments/:id/delete",
                        element: <PaymentDelete />,
                    },
                ]
            }
        ]
    },
    {
        title: "Categories",
        category: "Dictionaries",
        path: "/dictionary/categories",
        element: <CategorySearch />,
        menu: [
            { url: "/dictionary/categories/new", text: "Add New Category", icon: "plus-cricle" },
        ],
        children: [
            {
                title: "New",
                path: "/dictionary/categories/new",
                element: <CategoryNew />,
            },
            {
                title: "Edit",
                path: "/dictionary/categories/:id",
                element: <CategoryEdit />,
            },
            {
                title: "Delete",
                path: "/dictionary/categories/:id/delete",
                element: <CategoryDelete />,
            },
        ]
    },
    {
        title: "Companies",
        category: "Dictionaries",
        path: "/dictionary/companies",
        element: <CompanySearch />,
        menu: [
            { url: "/dictionary/companies/new", text: "Add New Company", icon: "plus-cricle" },
        ],
        children: [
            {
                title: "New",
                path: "/dictionary/companies/new",
                element: <CompanyNew />,
            },
            {
                title: "Edit",
                path: "/dictionary/companies/:id",
                element: <CompanyEdit />,
            },
            {
                title: "Delete",
                path: "/dictionary/companies/:id/delete",
                element: <CompanyDelete />,
            },
        ]
    },
    {
        title: "Currencies",
        category: "Dictionaries",
        path: "/dictionary/currencies",
        element: <CurrencySearch />,
        menu: [
            { url: "/dictionary/currencies/new", text: "Add New Currency", icon: "plus-cricle" },
        ],
        children: [
            {
                title: "New",
                path: "/dictionary/currencies/new",
                element: <CurrencyNew />,
            },
            {
                title: "Edit",
                path: "/dictionary/currencies/:id",
                element: <CurrencyEdit />,
            },
            {
                title: "Delete",
                path: "/dictionary/currencies/:id/delete",
                element: <CurrencyDelete />,
            },
        ]
    },
    {
        title: "Products",
        category: "Dictionaries",
        path: "/dictionary/products",
        element: <ProductSearch />,
        menu: [
            { url: "/dictionary/products/new", text: "Add New Product", icon: "plus-cricle" },
        ],
        children: [
            {
                title: "New",
                path: "/dictionary/products/new",
                element: <ProductNew />,
            },
            {
                title: "Edit",
                path: "/dictionary/products/:id",
                element: <ProductEdit />,
            },
            {
                title: "Delete",
                path: "/dictionary/products/:id/delete",
                element: <ProductDelete />,
            },
        ]
    },
    {
        title: "Taxes",
        category: "Dictionaries",
        path: "/dictionary/taxes",
        element: <TaxSearch />,
        children: [
            {
                title: "Edit",
                path: "/dictionary/taxes/:year",
                element: <TaxEdit />,
            },
        ]
    },
    {
        title: "Wallets",
        category: "Dictionaries",
        path: "/dictionary/wallets",
        element: <WalletSearch />,
        menu: [
            { url: "/dictionary/wallets/new", text: "Add New Wallet", icon: "plus-cricle" },
        ],
        children: [
            {
                title: "New",
                path: "/dictionary/wallets/new",
                element: <WalletNew />,
            },
            {
                title: "Edit",
                path: "/dictionary/wallets/:id",
                element: <WalletEdit />,
            },
            {
                title: "Delete",
                path: "/dictionary/wallets/:id/delete",
                element: <WalletDelete />,
            },
        ]
    },
    {
        title: "Test Index",
        path: "/test",
        element: <TestIndex />,
    },
];