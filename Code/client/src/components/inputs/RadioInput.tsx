import { ChangeEvent, FocusEvent, ForwardedRef, ReactNode } from "react";

interface Props {
    ref?: ForwardedRef<HTMLInputElement>;
    name?: string;
    className?: string;
    value?: string;
    defaultSelected?: boolean;
    disabled?: boolean;
    children?: ReactNode;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
}

export default function RadioInput({
    ref,
    name,
    className,
    value,
    defaultSelected,
    disabled,
    children,
    onChange,
    onBlur
}: Props) {
    return (
        <label className={
            `flex items-center `
            + (disabled ? "text-gray-disabled " : "")
            + (className ?? "")}
        >
            <input
                ref={ref}
                name={name}
                type="radio"
                className="
                    appearance-none
                    me-1 w-4 h-4
                    bg-radio-input bg-white
                    border border-gray-border rounded-full
                    checked:bg-blue-bg checked:border-blue-bg
                    focus:border-blue-bg focus:shadow-focus focus:shadow-blue-focus/25 focus:outline-none
                    disabled:checked:bg-blue-disabled disabled:checked:border-blue-disabled
                "
                value={value}
                defaultChecked={defaultSelected}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
            />
            {children}
        </label>
    );
}