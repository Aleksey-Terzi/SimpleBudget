import { ChangeEvent, FocusEvent, KeyboardEvent, RefObject, useCallback, useEffect, useState } from "react";
import { ComboBoxItem } from "./ComboBoxItem";
import { comboBoxEmptyValue, ComboBoxValue } from "./ComboBoxValue";
import { useStatusProvider } from "@/contexts/StatusProvider";
import { useLoadingProvider } from "@/contexts/LoadingProvider";

interface HoveredValue {
    value: string | null;
    triggeredByMouse: boolean;
}

export function useComboBox(
    value: ComboBoxValue | null | undefined,
    defaultValue: ComboBoxValue | null | undefined,
    onlySelect: boolean | undefined,
    items: ComboBoxItem[] | (() => ComboBoxItem[] | Promise<ComboBoxItem[]>),
    buttonRef:RefObject<HTMLButtonElement | null>, 
    panelRef: RefObject<HTMLDivElement | null>,
    inputRef: RefObject<HTMLInputElement | null>,
    onChange: ((value: ComboBoxValue) => void) | undefined,
    onBlur: (() => void) | undefined
) {
    const [allItems, setAllItems] = useState(() => Array.isArray(items) ? items : null);
    const [filteredItems, setFilteredItems] = useState(allItems ?? []);
    const [opened, setOpened] = useState(false);
    const [hoveredValue, setHoveredValue] = useState<HoveredValue>({ value: null, triggeredByMouse: false });
    const [storedValue, setStoredValue] = useState(value ?? defaultValue ?? comboBoxEmptyValue);
    const [text, setText] = useState(() => allItems ? getText(allItems, value ?? defaultValue) : "");

    const currentValue = value ?? storedValue;
    const setCurrentValue = value ? (onChange ?? (() => {})) : (
        (newValue: ComboBoxValue) => {
            setStoredValue(newValue);
            onChange?.(newValue);
        }
    );

    const closePanel = useCallback(() => {
        setOpened(false);
        setFilteredItems(allItems ?? []);
    }, [setOpened, setFilteredItems, allItems]);

    const { addError, removeError } = useStatusProvider();
    const { addLoading, removeLoading } = useLoadingProvider();

    useEffect(() => {
        if (allItems || Array.isArray(items)) {
            return;
        }

        const itemsResult = items();

        if (Array.isArray(itemsResult)) {
            setAllItems(itemsResult);
            setFilteredItems(itemsResult);
            return;
        }

        addLoading();

        itemsResult.then(result => {
            setAllItems(result);
            setFilteredItems(result);
            removeError();
        }).catch(err => {
            addError(err, "Combobox failed to load");
        }).finally(() => {
            removeLoading();
        });
    }, [addError, removeError, addLoading, removeLoading, allItems, items]);

    useEffect(() => {
        if (allItems) {
            setText(getText(allItems, currentValue));
        }
    }, [allItems, currentValue]);

    useEffect(() => {
        scrollToHoveredItem(
            panelRef.current,
            filteredItems,
            hoveredValue,
            opened
        );
    }, [panelRef, hoveredValue, filteredItems, opened]);

    function handleInputKeyDown(e: KeyboardEvent) {
        if (!opened) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                openPanel();
                e.preventDefault();
            } else if (e.key === "Enter") {
                syncCurrentValueWithText();
            }
            return;
        } else if (e.shiftKey && (e.key === "Home" || e.key === "End")) {
            return;
        }
        switch (e.key) {
            case "Enter":
                if (hoveredValue.value) {
                    setCurrentValue({ value: hoveredValue.value, type: "selected" });
                } else {
                    syncCurrentValueWithText();
                }
                closePanel();
                break;
            case "ArrowDown":
                hoverItem(hoveredValue.value, "moveDown");
                break;
            case "ArrowUp":
                hoverItem(hoveredValue.value, "moveUp");
                break;
            case "Escape":
                closePanel();
                break;
            case "Home":
                hoverItem(null, "moveHome");
                break;
            case "End":
                hoverItem(null, "moveEnd");
                break;
            default:
                return;
        }
        e.preventDefault();
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement, Element>) {
        if (!allItems) {
            return;
        }

        if (e.relatedTarget !== buttonRef.current
            && (!panelRef.current || !panelRef.current.contains(e.relatedTarget))
        ) {
            closePanel();
        }

        syncCurrentValueWithText();

        onBlur?.();
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        if (!allItems) {
            return;
        }

        setText(e.target.value);

        const newFilteredItems = e.target.value
            ? allItems.filter(x => x.text.toLowerCase().includes(e.target.value.toLowerCase()))
            : allItems;

        setFilteredItems(newFilteredItems);

        if (opened)  {
            syncHoveredValueWithCurrentValue(newFilteredItems);
        } else {
            openPanel(newFilteredItems);
        }
    }

    function handleInputClick() {
        if (!opened) {
            openPanel();
        }
        else if (onlySelect === true) {
            closePanel();
        }
    }

    function handleOpenButtonClicked() {
        if (!opened) {
            openPanel();
        } else {
            closePanel();
            inputRef.current?.focus();
        }
    }

    function hoverItem(value: string | null, operation: "none" | "moveDown" | "moveUp" | "moveHome" | "moveEnd", currentItems?: ComboBoxItem[]) {
        if (!currentItems) {
            currentItems = filteredItems;
        }

        let itemIndex = value !== null ? currentItems.findIndex(x => x.value === value) : -1;
        switch (operation) {
            case "moveDown":
                if (itemIndex >= 0) {
                    itemIndex++;
                } else {
                    itemIndex = 0;
                }
                break;
            case "moveUp":
                if (itemIndex >= 0) {
                    itemIndex--;
                } else {
                    itemIndex = 0;
                }
                break;
            case "moveHome":
                itemIndex = 0;
                break;
            case "moveEnd":
                itemIndex = currentItems.length - 1;
                break;
            default:
                break;
        }

        if (itemIndex < 0 || itemIndex >= currentItems.length) {
            return;
        }

        setHoveredValue({ value: currentItems[itemIndex].value, triggeredByMouse: false });
    }

    function openPanel(newFilteredItems: ComboBoxItem[] | null = null) {
        if (opened) {
            return;
        }

        syncHoveredValueWithCurrentValue(newFilteredItems ?? filteredItems);

        setOpened(true);

        inputRef.current?.focus();
    }

    function syncCurrentValueWithText() {
        const item = allItems?.find(x => x.text.toLowerCase() === text.toLowerCase());

        const newCurrentValue: ComboBoxValue = item
            ? {
                value: item.value,
                type: "selected"
            }: {
                value: text,
                type: "custom"
            };

        if (newCurrentValue.value === currentValue.value
            && newCurrentValue.type === currentValue.type
        ) {
            setText(item?.text ?? text);
        } else {
            setCurrentValue(newCurrentValue);
        }
    }

    function syncHoveredValueWithCurrentValue(newFilteredItems: ComboBoxItem[]) {
        const newHoveredValue = currentValue.type === "selected" && newFilteredItems.find(x => x.value === currentValue.value)
            ? currentValue.value
            : null;

        setHoveredValue({ value: newHoveredValue, triggeredByMouse: false });
    }

    return {
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

        scrollToHoveredItem: () => scrollToHoveredItem(
            panelRef.current,
            filteredItems,
            hoveredValue,
            opened
        ),
    };
}

function getText(allItems: ComboBoxItem[] | null, value: ComboBoxValue | null | undefined) {
    if (!allItems || !value?.value) {
        return "";
    }
    const text = value.type === "selected" ? allItems.find(x => x.value === value.value)?.text : value.value;
    return text ?? "";
}

function scrollToHoveredItem(
    panel: HTMLDivElement | null,
    filteredItems: ComboBoxItem[],
    hoveredValue: HoveredValue,
    opened: boolean,
) {
    if (!panel || !hoveredValue.value || hoveredValue.triggeredByMouse || !opened) {
        return;
    }

    const index = filteredItems.findIndex(x => x.value === hoveredValue.value);
    const parent = panel.children[0] as HTMLElement;
    if (index < 0 || index >= parent.children.length) {
        return;
    }

    const { height: parentHeight } = parent.getBoundingClientRect();

    const item = parent.children[index] as HTMLElement;
    const itemTop = item.offsetTop - parent.offsetTop - parent.scrollTop;
    const { height: itemHeight } = item.getBoundingClientRect();

    if (itemTop >= 0 && itemTop < parentHeight - itemHeight) {
        return;
    }

    let scrollTop = parent.scrollTop + itemTop;
    if (itemTop > 0 || itemTop + itemHeight < 0) {
        scrollTop += itemHeight - parentHeight;
    }

    parent.scrollTo({ top: scrollTop });
}