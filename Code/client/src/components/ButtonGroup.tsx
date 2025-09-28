import { ReactNode } from "react";
import Icon, { IconType } from "./Icon";
import Spinner from "./Spinner";

interface Button {
    key: string;
    type?: "button" | "submit";
    text?: ReactNode;
    icon?: IconType;
    isLoading?: boolean;
}

interface Props {
    className?: string;
    selectedKey?: string | null;
    disabled?: boolean;
    children?: Button[];
    onClick?: (key: string) => void;
}

export default function ButtonGroup({
    className,
    selectedKey,
    disabled,
    children,
    onClick
}: Props) {
    return (
        <div className={`
            flex
            [&>button]:px-3 [&>button]:py-1.5 [&>button]:text-center
            [&>button]:transition
            [&>button:first-child]:rounded-s-lg
            [&>button:last-child]:rounded-e-lg
            [&>button:last-child]:border-e
            [&>button]:border-s [&>button]:border-y
            [&>button:focus]:outline-none
            [&>button_svg.spinner]:stroke-blue-bg [&_svg.spinner]:fill-blue-bg

            [&>button]:border-gray-border
            [&>button]:bg-gray-bg
            [&>button:hover:enabled]:bg-gray-hover
            [&>button[data-selected]]:bg-gray-hover
            [&>button:not([data-loading]):disabled]:text-gray-disabled
        ` + (className ?? "")}>
            {children && children.map(({ key, type, text, icon, isLoading }) => (
                <button
                    key={key}
                    type={type ?? "button"}
                    className={icon ? "flex items-center gap-2" : undefined}
                    disabled={disabled === true || isLoading === true}
                    data-selected={selectedKey === key ? true : undefined}
                    data-loading={isLoading === true ? true: undefined}
                    onClick={() => onClick?.(key)}
                >
                    {isLoading === true ? (
                        <div className="w-4 h-4"><Spinner /></div>
                    ): (
                        icon && <Icon icon={icon} />
                    )}
                    {text}
                </button>
            ))}
        </div>
    )
}