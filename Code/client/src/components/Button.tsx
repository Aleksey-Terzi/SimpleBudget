import { MouseEvent, ReactNode } from "react"
import { Link } from "react-router";
import Spinner from "./Spinner";
import Icon, { IconType } from "./Icon";

type Variant = "default" | "submit" | "search" | "clear" | "cancel" | "add";
type Type = "button" | "submit";

const _blueVariantClass = `
    px-3 py-1.5 text-sm text-center transition rounded-lg border
    focus:border-blue-focus focus:shadow-focus focus:shadow-blue-focus/25 focus:outline-none

    border-blue-border
    bg-blue-bg
    text-contrast-text
    data-[enabled]:hover:bg-blue-hover
    [&:not([data-loading])]:disabled:bg-blue-disabled
    [&_svg.spinner]:stroke-white-bg [&_svg.spinner]:fill-white-bg
`;

const _grayVariantClass = `
    px-3 py-1.5 text-sm text-center transition rounded-lg border
    focus:border-blue-focus focus:shadow-focus focus:shadow-blue-focus/25 focus:outline-none

    border-gray-border
    bg-gray-bg
    text-main-text
    data-[enabled]:hover:bg-gray-hover
    [&:not([data-loading])]:disabled:text-gray-disabled
    [&_svg.spinner]:stroke-blue-bg [&_svg.spinner]:fill-blue-bg
`;

const _utilityVariantClass = `
    px-3 py-1 text-sm text-center transition rounded-full border
    focus:border-blue-focus focus:shadow-focus focus:shadow-blue-focus/25 focus:outline-none

    border-gray-border
    bg-white-bg
    data-[enabled]:hover:bg-gray-hover
    [&:not([data-loading])]:disabled:text-gray-disabled
    [&_svg.spinner]:stroke-blue-bg [&_svg.spinner]:fill-blue-bg
`;

interface VariantDescr {
    icon: IconType | null;
    className: string;
    text: string | null;
    type: Type,
    loadingText: string | null,
}

const _variants: {
    [key: string]: VariantDescr
} = {
    default: {
        icon: null,
        className: _grayVariantClass,
        text: null,
        type: "button",
        loadingText: null,
    },
    submit: {
        icon: "submit",
        className: _blueVariantClass,
        text: "Submit",
        type: "submit",
        loadingText: "Submitting...",
    },
    search: {
        icon: "search",
        className: _blueVariantClass,
        text: "Search",
        type: "submit",
        loadingText: "Searching...",
    },
    clear: {
        icon: "reset",
        className: _grayVariantClass,
        text: "Clear",
        type: "submit",
        loadingText: "Clearing...",
    },
    cancel: {
        icon: "x-mark",
        className: _grayVariantClass,
        text: "Cancel",
        type: "button",
        loadingText: "Cancelling...",
    },
    add: {
        icon: "plus-cricle",
        className: _utilityVariantClass,
        text: "Add",
        type: "button",
        loadingText: "Adding...",
    }
}

interface Props {
    children?: ReactNode;
    name?: string;
    className?: string;
    href?: string;
    icon?: IconType;
    disabled?: boolean;
    variant?: Variant;
    type?: Type;
    isLoading?: boolean;
    loadingText?: ReactNode;
    onClick?: (e: MouseEvent) => void;
}

export default function Button({
    children,
    name,
    className,
    href,
    icon,
    disabled,
    variant,
    type,
    isLoading,
    loadingText,
    onClick,
}: Props) {
    const { mergedIcon, mergedClassName, mergedText, mergedType, mergedLoadingText } = mergeWithVariant(icon, className, children, variant, type, loadingText);

    const finalIcon = isLoading
        ? (<Spinner />)
        : mergedIcon;

    const finalText = isLoading ? mergedLoadingText : mergedText;

    let fullClassName = "";
    if (finalIcon) {
        fullClassName += "flex items-center";
    }
    if (mergedClassName) {
        fullClassName += mergedClassName;
    }

    if (href && !disabled && !isLoading) {
        return (
            <Link
                to={href}
                data-enabled={true}
                className={fullClassName}
            >
                {finalIcon && <div className="w-4 h-4 me-2">{finalIcon}</div>}
                {finalText}
            </Link>
        );
    }

    return (
        <button
            name={name}
            type={mergedType}
            disabled={disabled || isLoading}
            data-enabled={disabled ? undefined : true}
            data-loading={isLoading ? true : undefined}
            className={fullClassName}
            onClick={onClick}
        >
            {finalIcon ? <div className="w-4 h-4 me-2">{finalIcon}</div> : null}
            {finalText}
        </button>
    );
}

function mergeWithVariant(
    icon: IconType | undefined,
    className: string | undefined,
    text: ReactNode | undefined,
    variant: Variant | undefined = "default",
    type: Type | undefined,
    loadingText: ReactNode | undefined,
): {
    mergedIcon: ReactNode | null,
    mergedClassName: string,
    mergedText: ReactNode | string | null,
    mergedType: Type,
    mergedLoadingText: ReactNode | string | null,
} {
    const { icon: variantIcon, className: variantClassName, text: variantText, type: variantType, loadingText: variantLoadingText } = _variants[variant];

    const mergedIcon = icon ?? variantIcon

    return {
        mergedIcon: mergedIcon ? <Icon icon={mergedIcon} /> : null,
        mergedClassName: variantClassName + (className ?? ""),
        mergedText: text ?? variantText,
        mergedType: type ?? variantType as Type,
        mergedLoadingText: loadingText ?? variantLoadingText ?? variantText ?? text,
    };
}