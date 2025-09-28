import { ForwardedRef, KeyboardEvent, useEffect, useState } from "react";
import { FieldError } from "react-hook-form";
import { errorHelper } from "@/helpers/errorHelper";
import { DigitType, numberHelper } from "@/helpers/numberHelper";

export interface DecimalInputProps {
    ref?: ForwardedRef<HTMLInputElement>,
    name?: string;
    className?: string;
    autoFocus?: boolean;
    maxLength?: number;
    disabled?: boolean;
    readOnly?: boolean;
    value?: number | null;
    defaultValue?: number | null;
    placeholder?: string;
    showDollarSign?: boolean;
    digits?: DigitType;
    error?: FieldError;
    onChange?: (value: number | null) => void;
    onBlur?: () => void;
}

export default function DecimalInput({
    ref,
    name,
    className,
    autoFocus,
    maxLength,
    disabled,
    readOnly,
    value,
    defaultValue,
    placeholder,
    showDollarSign,
    digits,
    error,
    onChange,
    onBlur,
}: DecimalInputProps) {
    const [storedValue, setStoredValue] = useState(defaultValue ?? null);

    const currentValue = value !== undefined ? value : storedValue;
    const setCurrentValue = value !== undefined
        ? (onChange ?? (() => {})) : (
            (newValue: number | null) => {
                setStoredValue(newValue);
                onChange?.(newValue);
            }
        );

    const [text, setText] = useState(() => format(showDollarSign, digits, currentValue));

    const errorTooltip = errorHelper.getErrorTooltip(error);

    useEffect(() => {
        setText(format(showDollarSign, digits, currentValue));
    }, [showDollarSign, digits, currentValue]);

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (disabled || readOnly) {
            return;
        }

        const input = e.target as HTMLInputElement;
        const value = input.value;

        const isAllowed =
            e.ctrlKey
            || (e.shiftKey && e.key === "Insert")
            || e.key === "Tab"
            || e.key >= "0" && e.key <= "9"
            || e.key === "Control"
            || e.key === "Shift"
            || e.key === "ArrowLeft"
            || e.key === "ArrowRight"
            || e.key === "End"
            || e.key === "Home"
            || e.key === "Clear"
            || e.key === "Delete"
            || e.key === "Backspace"
            || e.key === "Enter"
            || e.key === ","
            || e.key === "$" && !value.includes("$")
            || e.key === "." && !value.includes(".")
            || e.key === "-" && !value.includes("-")
            ;

        if (e.key === "Enter") {
            submitChangedValue();
        }

        if (!isAllowed) {
            e.preventDefault();
        }
    }

    function handleBlur() {
        submitChangedValue();
        onBlur?.();
    }

    function submitChangedValue() {
        const newValue = text
            ? numberHelper.parseDecimal(text)
            : null;

        setCurrentValue(newValue);
    }

    return (
        <input
            ref={ref}
            name={name}
            type="text"
            className={`
                block rounded-lg border border-gray-border py-1.5 px-3 text-main-text
                placeholder:text-gray-disabled
                focus:border-blue-focus focus:shadow-focus focus:shadow-blue-focus/25 focus:outline-none
                data-[invalid]:border-red-invalid data-[invalid]:shadow-red-invalid/25
                w-full
            ` + (className ?? "")}
            autoFocus={autoFocus}
            title={errorTooltip}
            disabled={disabled}
            readOnly={readOnly}
            value={text}
            placeholder={placeholder}
            maxLength={maxLength ?? 20}
            data-invalid={error ? "true": undefined}
            onKeyDown={handleKeyDown}
            onChange={e => setText(e.target.value)}
            onBlur={handleBlur}
        />
    );
}

function format(showDollarSign: boolean | undefined, digits: DigitType | undefined, value: number | null) {
    const result = showDollarSign !== true
        ? numberHelper.formatDecimal(value, digits)
        : numberHelper.formatCurrency(value);

    return result ?? "";
}