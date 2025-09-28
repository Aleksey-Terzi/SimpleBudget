import { ForwardedRef, KeyboardEvent, useEffect, useState } from "react";
import { FieldError } from "react-hook-form";
import { errorHelper } from "@/helpers/errorHelper";
import { numberHelper } from "@/helpers/numberHelper";

export interface IntegerInputProps {
    ref?: ForwardedRef<HTMLInputElement>,
    name?: string;
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
    value?: number | null;
    defaultValue?: number | null;
    placeholder?: string;
    error?: FieldError;
    onChange?: (value: number | null) => void;
    onBlur?: () => void;
}

export default function IntegerInput({
    ref,
    name,
    className,
    disabled,
    readOnly,
    value,
    defaultValue,
    placeholder,
    error,
    onChange,
    onBlur,
}: IntegerInputProps) {
    const [storedValue, setStoredValue] = useState(defaultValue ?? null);

    const currentValue = value !== undefined ? value : storedValue;
    const setCurrentValue = value !== undefined
        ? (onChange ?? (() => {})) : (
            (newValue: number | null) => {
                setStoredValue(newValue);
                onChange?.(newValue);
            }
        );

    const [text, setText] = useState(() => format(currentValue));

    const errorTooltip = errorHelper.getErrorTooltip(error);

    useEffect(() => {
        setText(format(currentValue));
    }, [currentValue]);

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (disabled || readOnly) {
            return;
        }

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
            ? numberHelper.parseInt(text)
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
            title={errorTooltip}
            disabled={disabled}
            readOnly={readOnly}
            value={text}
            placeholder={placeholder}
            maxLength={20}
            data-invalid={error ? "true": undefined}
            onKeyDown={handleKeyDown}
            onChange={e => setText(e.target.value)}
            onBlur={handleBlur}
        />
    );
}

function format(value: number | null | undefined) {
    return value !== null && value !== undefined ? String(value) : "";
}