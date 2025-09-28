import { KeyboardEvent, useEffect, useState } from "react";
import { dateHelper } from "@/helpers/date/dateHelper";
import { DateParts, FormatType, InvalidDate, isInvalidDate } from "@/helpers/date/dateTypes";

export const dateInputFormatType: FormatType = "mm/dd/yyyy";

export function useDateInput(
    disabled: boolean | undefined,
    readOnly: boolean | undefined,
    value: DateParts | InvalidDate | null | undefined,
    defaultValue: DateParts | InvalidDate | null | undefined,
    onFocus: () => void,
    onChange: ((value: DateParts | InvalidDate | null) => void) | undefined,
    onBlur: (() => void) | undefined
) {
    const [storedValue, setStoredValue] = useState(value ?? defaultValue);
    const [text, setText] = useState(() => {
        return isInvalidDate(storedValue)
            ? storedValue.text
            : dateHelper.format(storedValue, dateInputFormatType) ?? "";
    });

    const [calendarState, setCalendarState] = useState<{ opened: boolean, date: DateParts | null }>({ opened: false, date: null });

    const currentValue = value !== undefined ? value : storedValue;
    const setCurrentValue = value !== undefined
        ? (onChange ?? (() => {})) : (
            (newValue: DateParts | InvalidDate | null) => {
                setStoredValue(newValue);
                onChange?.(newValue);
            }
        );

    useEffect(() => {
        if (isInvalidDate(currentValue)) {
            setText(currentValue.text);
        } else {
            setText(dateHelper.format(currentValue, dateInputFormatType) ?? "");
        }
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
            || e.key >= "a" && e.key <= "z"
            || e.key >= "A" && e.key <= "Z"
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
            || dateHelper.isSeparator(e.key)
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

    function handleOpenButtonClicked() {
        if (calendarState.opened) {
            setCalendarState({
                opened: false,
                date: null
            });
            onFocus();
        } else {
            setCalendarState({
                opened: true,
                date: currentValue && !isInvalidDate(currentValue) ? currentValue : null
            });
        }
    }

    function handleCalendarChange(value: DateParts) {
        setCurrentValue(value);
        
        setCalendarState({
            opened: false,
            date: value
        });

        onFocus();
    }

    function handleCalendarClose(escPressed: boolean) {
        if (escPressed) {
            onFocus();
        }

        setCalendarState({
            opened: false,
            date: null
        });
    }

    function submitChangedValue() {
        let newValue: DateParts | InvalidDate | null;

        if (!text) {
            newValue = null;
        } else {
            const date = dateHelper.parse(text);
            newValue = date ?? {
                isInvalid: true,
                text
            };
        }

        setCurrentValue(newValue);
    }

    return {
        text,
        calendarState,
        setText,
        handleKeyDown,
        handleBlur,
        handleOpenButtonClicked,
        handleCalendarChange,
        handleCalendarClose,
    }
}