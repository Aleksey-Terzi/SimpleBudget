import { ForwardedRef, useImperativeHandle, useRef } from "react";
import { FieldError } from "react-hook-form";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { errorHelper } from "@/helpers/errorHelper";
import { ComboBoxValue } from "./ComboBoxValue";
import { ComboBoxItem } from "./ComboBoxItem";
import { useComboBox } from "./useComboBox";
import PopupPanel from "@/components/PopupPanel";

export interface ComboBoxProps {
    ref?: ForwardedRef<HTMLInputElement>;
    className?: string;
    disabled?: boolean;
    value?: ComboBoxValue | null;
    defaultValue?: ComboBoxValue | null;
    onlySelect?: boolean;
    maxLength?: number;
    height?: number;
    error?: FieldError;
    items: ComboBoxItem[] | (() => ComboBoxItem[] | Promise<ComboBoxItem[]>);
    onChange?: (value: ComboBoxValue) => void;
    onBlur?: () => void;
}

export default function ComboBox({
    ref,
    className,
    disabled,
    value,
    defaultValue,
    onlySelect,
    maxLength,
    height,
    items,
    error,
    onChange,
    onBlur,
}: ComboBoxProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current);

    const {
        opened,
        allItems,
        filteredItems,
        text,
        currentValue,
        hoveredValue,
        setCurrentValue,
        setHoveredValue,
        closePanel,
        handleInputKeyDown,
        handleInputBlur,
        handleInputChange,
        handleInputClick,
        handleOpenButtonClicked,
        scrollToHoveredItem,
    } = useComboBox(
        value,
        defaultValue,
        onlySelect,
        items,
        buttonRef,
        panelRef,
        inputRef,
        onChange,
        onBlur
    )

    const errorTooltip = errorHelper.getErrorTooltip(error);

    function handleClick(value: string) {
        setCurrentValue({
            value,
            type: "selected",
        });
        closePanel();
        inputRef.current?.focus();
    }

    function handleMouseOver(value: string) {
        setHoveredValue({ value, triggeredByMouse: true })
    }

    return (
        <div className={"relative " + (className ?? "")}>
            <input
                ref={inputRef}
                className="
                    w-full rounded-lg border border-gray-border py-1.5 pr-8 pl-3 text-main-text
                    placeholder:text-gray-disabled
                    data-[onlyselect]:cursor-default
                    focus:border-blue-focus focus:shadow-focus focus:shadow-blue-focus/25 focus:outline-none
                    data-[invalid]:border-red-invalid data-[invalid]:shadow-red-invalid/25
                "
                title={errorTooltip}
                disabled={disabled || !allItems}
                readOnly={onlySelect === true}
                value={text}
                maxLength={maxLength}
                data-onlyselect={onlySelect === true ? true: undefined}
                data-invalid={error ? true: undefined}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                onClick={handleInputClick}
            />
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled || !allItems}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 px-2.5"
                onClick={handleOpenButtonClicked}
            >
                <ChevronDownIcon className="size-4 fill-main-text" />
            </button>
            {opened && inputRef.current && (
                <PopupPanel
                    ref={panelRef}
                    relative={inputRef.current}
                    className="w-[var(--popup-panel-relative-width)]"
                    maxHeight={height}
                    onOpen={() => scrollToHoveredItem()}
                >
                    {filteredItems.length > 0 ? (
                        <div className="overflow-y-auto max-h-[var(--popup-panel-max-height)]" tabIndex={-1}>
                            {filteredItems.map(({ value, text }) => (
                                <button
                                    key={value}
                                    type="button"
                                    tabIndex={-1}
                                    data-hovered={hoveredValue.value === value && (currentValue.type === "custom" || currentValue.value !== value) ? true : undefined}
                                    data-selected={currentValue.type === "selected" && currentValue.value === value ? true: undefined}
                                    className="
                                        block w-full text-left
                                        p-1.5 rounded-lg cursor-pointer
                                        data-[hovered]:bg-gray-hover
                                        data-[selected]:bg-blue-bg data-[selected]:text-contrast-text
                                    "
                                    onClick={() => handleClick(value)}
                                    onMouseOver={() => handleMouseOver(value)}
                                >
                                    {text ? text : <>&nbsp;</>}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-2 text-gray-disabled">
                            No data found
                        </div>
                    )}
                </PopupPanel>
            )}
        </div>
    )
}