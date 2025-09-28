import Icon, { IconType } from "@/components/Icon";
import { isLocal } from "@/helpers/settings";
import { NavLink } from "react-router";
import { Fragment } from "react/jsx-runtime";

interface MenuItem {
    title: string;
    items: {
        url: string;
        title: string;
        icon: IconType;
    }[];
}

const _menuItems: MenuItem[] = [
    {
        title: "Budget",
        items: [
            { url: "/budget/payments", title: "Payments", icon: "banknotes" },
            { url: "/budget/prices", title: "Prices", icon: "dollar" },
            { url: "/budget/plans", title: "Plans", icon: "calendar-days" },
            { url: "/budget/taxes", title: "Taxes", icon: "calculator" },
        ]
    },
    {
        title: "Reports",
        items: [
            { url: "/report/summary", title: "Summary", icon: "chart-bar" },
            { url: "/report/monthly-report", title: "Monthly Report", icon: "chart-bar" },
        ]
    },
    {
        title: "Dictionaries",
        items: [
            { url: "/dictionary/categories", title: "Categories", icon: "chart-pie" },
            { url: "/dictionary/companies", title: "Companies", icon: "building-storefront" },
            { url: "/dictionary/currencies", title: "Currencies", icon: "dollar" },
            { url: "/dictionary/products", title: "Products", icon: "cog-6-tooth" },
            { url: "/dictionary/taxes", title: "Taxes", icon: "calculator" },
            { url: "/dictionary/wallets", title: "Wallets", icon: "briefcase" },
        ]
    },
];

if (isLocal()) {
    _menuItems.push({
        title: "Tests",
        items: [
            { url: "/test", title: "Test Index", icon: "beaker" },
        ]
    });
}

export default function Sidebar() {
    return (
        <>
            {_menuItems.map(({ title, items }) => (
                <Fragment key={title}>
                    <div className="text-base border-b border-gray-border pb-1 mt-3 mb-2">{title}</div>
                    <ul className="
                        [&>li>a]:p-2 [&>li>a]:flex [&>li>a]:gap-3 [&>li>a]:items-center [&>li>a]:rounded-lg
                        [&>li>a.active]:bg-gray-hover
                        hover:[&>li>a]:bg-gray-hover
                    ">
                        {items.map(({ url, title, icon }) => (
                            <li key={url}>
                                <NavLink to={url}>
                                    <Icon icon={icon} />
                                    {title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </Fragment>
            ))}
        </>
    )
}