import { ArrowDownTrayIcon, ArrowPathIcon, ArrowRightEndOnRectangleIcon, ArrowUpTrayIcon, ArrowUturnLeftIcon, BanknotesIcon, BeakerIcon, BellIcon, BriefcaseIcon, BuildingStorefrontIcon, CalculatorIcon, CalendarDaysIcon, ChartBarIcon, ChartPieIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CircleStackIcon, Cog6ToothIcon, CreditCardIcon, CurrencyDollarIcon, LockClosedIcon, LockOpenIcon, MagnifyingGlassIcon, PencilIcon, PlusCircleIcon, ShoppingCartIcon, TrashIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { CurrencyDollarIcon as CurrencyDollarIconOutline } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

export type IconType = "search" | "data" | "submit" | "chevron-left" | "chevron-right" | "chevron-down" | "reset" | "dollar" | "banknotes" | "credit-card" |
    "calendar-days" | "calculator" | "chart-bar" | "beaker" | "building-storefront" | "cog-6-tooth" | "briefcase" | "chart-pie" | "arrow-right-end-on-rectangle" |
    "shopping-cart" | "plus-cricle" | "arrow-up-tray" | "pencil" | "x-circle" | "x-mark" | "trash" | "arrow-uturn-left" | "bell" |
    "lock-closed" | "lock-open";

const _icons = {
    search: () => <MagnifyingGlassIcon />,
    data: () => <CircleStackIcon />,
    submit: () => <ArrowDownTrayIcon />,
    "chevron-left": () => <ChevronLeftIcon />,
    "chevron-right": () => <ChevronRightIcon />,
    "chevron-down": () => <ChevronDownIcon />,
    reset: () => <ArrowPathIcon />,
    dollar: () => <CurrencyDollarIcon />,
    "banknotes": () => <BanknotesIcon />,
    "credit-card": () => <CreditCardIcon />,
    "calendar-days": () => <CalendarDaysIcon />,
    "calculator": () => <CalculatorIcon />,
    "chart-bar": () => <ChartBarIcon />,
    "beaker": () => <BeakerIcon />,
    "building-storefront": () => <BuildingStorefrontIcon />,
    "cog-6-tooth": () => <Cog6ToothIcon />,
    "briefcase": () => <BriefcaseIcon />,
    "chart-pie": () => <ChartPieIcon />,
    "arrow-right-end-on-rectangle": () => <ArrowRightEndOnRectangleIcon />,
    "shopping-cart": () => <ShoppingCartIcon />,
    "plus-cricle": () => <PlusCircleIcon />,
    "arrow-up-tray": () => <ArrowUpTrayIcon />,
    "pencil": () => <PencilIcon />,
    "x-circle": () => <XCircleIcon />,
    "x-mark": () => <XMarkIcon />,
    "trash": () => <TrashIcon />,
    "arrow-uturn-left": () => <ArrowUturnLeftIcon />,
    "bell": () => <BellIcon />,
    "lock-closed": () => <LockClosedIcon />,
    "lock-open": () => <LockOpenIcon />,
}

const _iconsOutline = {
    search: () => { throw new Error("Not implemented") },
    data: () => { throw new Error("Not implemented") },
    submit: () => { throw new Error("Not implemented") },
    "chevron-left": () => { throw new Error("Not implemented") },
    "chevron-right": () => { throw new Error("Not implemented") },
    "chevron-down": () => { throw new Error("Not implemented") },
    reset: () => { throw new Error("Not implemented") },
    dollar: () => <CurrencyDollarIconOutline />,
    "banknotes": () => { throw new Error("Not implemented") },
    "credit-card": () => { throw new Error("Not implemented") },
    "calendar-days": () => { throw new Error("Not implemented") },
    "calculator": () => { throw new Error("Not implemented") },
    "chart-bar": () => { throw new Error("Not implemented") },
    "beaker": () => { throw new Error("Not implemented") },
    "building-storefront": () => { throw new Error("Not implemented") },
    "cog-6-tooth": () => { throw new Error("Not implemented") },
    "briefcase": () => { throw new Error("Not implemented") },
    "chart-pie": () => { throw new Error("Not implemented") },
    "arrow-right-end-on-rectangle": () => { throw new Error("Not implemented") },
    "shopping-cart": () => { throw new Error("Not implemented") },
    "plus-cricle": () => { throw new Error("Not implemented") },
    "arrow-up-tray": () => { throw new Error("Not implemented") },
    "pencil": () => { throw new Error("Not implemented") },
    "x-circle": () => { throw new Error("Not implemented") },
    "x-mark": () => { throw new Error("Not implemented") },
    "trash": () => { throw new Error("Not implemented") },
    "arrow-uturn-left": () => { throw new Error("Not implemented") },
    "bell": () => { throw new Error("Not implemented") },
    "lock-closed": () => { throw new Error("Not implemented") },
    "lock-open": () => { throw new Error("Not implemented") },
}

interface Props {
    icon: IconType;
    className?: string;
    variant?: "solid" | "outline";
    title?: string;
}

export default function Icon({ icon, className, variant, title }: Props) {
    let component: ReactNode;

    switch (variant) {
        case "outline":
            component = _iconsOutline[icon]();
            break;
        case "solid":
        case undefined:
            component = _icons[icon]();
            break;
        default:
            throw new Error(`Unsupporetd variant: ${variant}`);
    }

    return (
        <div className={`size-4 ${className ?? ""}`} title={title}>
            {component}
        </div>
    )
}