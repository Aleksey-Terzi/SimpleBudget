import { errorHelper } from "@/helpers/errorHelper";
import { CalendarIcon } from "@heroicons/react/16/solid";
import { ForwardedRef, useImperativeHandle, useRef } from "react";
import { FieldError } from "react-hook-form";
import DateInput_Calendar from "./DateInput_Calendar";
import { DateParts, InvalidDate } from "@/helpers/date/dateTypes";
import { useDateInput } from "./useDateInput";

export interface DateInputProps {
    ref?: ForwardedRef<HTMLInputElement>,
    name?: string;
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
    autoFocus?: boolean;
    value?: DateParts | InvalidDate | null;
    defaultValue?: DateParts | InvalidDate | null;
    placeholder?: string;
    error?: FieldError;
    onChange?: (value: DateParts | InvalidDate | null) => void;
    onBlur?: () => void;
}

export default function DateInput({
    ref,
    name,
    className,
    disabled,
    readOnly,
    autoFocus,
    value,
    defaultValue,
    placeholder,
    error,
    onChange,
    onBlur,
}: DateInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const {
        text,
        calendarState,
        setText,
        handleKeyDown,
        handleBlur,
        handleOpenButtonClicked,
        handleCalendarChange,
        handleCalendarClose,
    } = useDateInput(
        disabled,
        readOnly,
        value,
        defaultValue,
        () => inputRef.current?.focus(),
        onChange,
        onBlur
    )

    const errorTooltip = errorHelper.getErrorTooltip(error);

    return (
        <div className={"relative " + (className ?? "")}>
            <input
                ref={inputRef}
                name={name}
                type="text"
                data-calendar-opened={calendarState.opened ? true : undefined}
                className={`
                    w-full rounded-lg border border-gray-border py-1.5 pl-3 pr-8 text-main-text
                    placeholder:text-gray-disabled
                    focus:border-blue-focus focus:shadow-focus focus:shadow-blue-focus/25 focus:outline-none
                    data-[invalid]:border-red-invalid data-[invalid]:shadow-red-invalid/25
                `}
                title={errorTooltip}
                disabled={disabled}
                readOnly={readOnly}
                autoFocus={autoFocus}
                value={text}
                placeholder={placeholder}
                maxLength={20}
                data-invalid={errorTooltip ? "true": undefined}
                onKeyDown={handleKeyDown}
                onChange={e => setText(e.target.value)}
                onBlur={handleBlur}
            />
            {!disabled && !readOnly && (
                <>
                    <button
                        ref={buttonRef}
                        type="button"
                        tabIndex={-1}
                        className="absolute inset-y-0 right-0 px-2.5"
                        onClick={handleOpenButtonClicked}
                    >
                        <CalendarIcon className="size-4 fill-main-text" />
                    </button>
                    {calendarState.opened && inputRef.current && (
                        <DateInput_Calendar
                            relative={inputRef.current}
                            trigger={buttonRef.current}
                            value={calendarState.date}
                            onChange={handleCalendarChange}
                            onClose={handleCalendarClose}
                        />
                    )}
                </>
            )}
        </div>
    );
}