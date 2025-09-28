import { ChangeEvent, FocusEvent, ForwardedRef } from "react";
import { FieldError } from "react-hook-form";
import { errorHelper } from "@/helpers/errorHelper";

interface Props {
    ref?: ForwardedRef<HTMLInputElement>,
    name?: string;
    type?: "text" | "password";
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
    defaultValue?: string;
    autoFocus?: boolean;
    placeholder?: string;
    maxLength?: number;
    error?: FieldError;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
}

export default function TextInput({
    ref,
    name,
    type,
    className,
    disabled,
    readOnly,
    defaultValue,
    autoFocus,
    placeholder,
    maxLength,
    error,
    onChange,
    onBlur
}: Props) {
    const errorTooltip = errorHelper.getErrorTooltip(error);

    return (
        <input
            ref={ref}
            name={name}
            type={type}
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
            defaultValue={defaultValue}
            autoFocus={autoFocus}
            placeholder={placeholder}
            maxLength={maxLength}
            data-invalid={error ? "true": undefined}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}