import { ChangeEvent, forwardRef } from "react";
import { FormControl } from "react-bootstrap";
import stringHelper from "../utils/stringHelper";

interface Props {
    className?: string,
    name?: string,
    title?: string,
    defaultValue?: string;
    value?: string;
    disabled?: boolean;
    items?: string[];
    isInvalid?: boolean;
    maxLength?: number,
    onChange?: (e: ChangeEvent) => void;
    onBlur?: (e: FocusEvent) => void;
}

const SearchSelector = forwardRef(({ className, name, title, defaultValue, value, disabled, items, isInvalid, maxLength, onChange, onBlur }: Props, ref: any) => {
    function handleButtonClick(e: any) {
        const $root = e.target.parentElement;
        const $menu = $root.querySelector("ul");

        if ($menu.offsetWidth !== 0 || $menu.offsetHeight !== 0) {
            $menu.style.display = "none";
        } else {
            const $input = $root.querySelector("input");
            $input.focus();
        }
    }

    function handleInputFocus(e: any) {
        showDropDownMenu(e.target.parentElement);

        if (isFilterTextChanged(e.target)) {
            filterMenuItems(e.target);
        }
    }

    function handleInputBlur(e: any) {
        const $root = e.target.parentElement;

        if (e.relatedTarget !== $root.querySelector("button")) {
            if (e.relatedTarget) {
                var $relatedTarget = e.relatedTarget;
                var $parent = $relatedTarget.parentElement.parentElement;

                if ($parent && $parent === $root.querySelector(".dropdown-menu"))
                    selectMenuItem($relatedTarget.parentElement);
            }

            const $menu = $root.querySelector("ul");
            $menu.style.display = "none";
        }

        if (onBlur) {
            onBlur(e);
        }
    }

    function handleInputKeyDown(e: any) {
        var $menu = e.target.parentElement.querySelector(".dropdown-menu");

        switch (e.which) {
            case 13: // Enter
            case 27: // Esc
                $menu.style.display = "none";
                e.preventDefault();
                break;
            case 38: // ArrowUp
                moveUp($menu);
                e.preventDefault();
                break;
            case 40: // ArrowDown
                moveDown($menu);
                e.preventDefault();
                break;
        }
    }

    function handleInputKeyUp(e: any) {
        switch (e.which) {
            case 13: // Enter
            case 27: // Esc
            case 37: // ArrowLeft
            case 38: // ArrowUp
            case 39: // ArrowRight
            case 40: // ArrowDown
                return;
        }

        filterMenuItems(e.target);
    }

    function showDropDownMenu($root: any) {
        const $menu = $root.querySelector("ul");
        if ($menu.offsetWidth !== 0 || $menu.offsetHeight !== 0) {
            return;
        }

        const $button = $root.querySelector("button");
        const $input = $root.querySelector("input");

        const inputWidth = $input.offsetWidth;
        const inputHeight = $input.offsetHeight;
        const buttonWidth = $button.offsetWidth;
        const width = inputWidth + buttonWidth;

        $menu.style.width = String(width) + "px";
        $menu.style["margin-top"] = String(inputHeight + 2) + "px";
        $menu.style["margin-left"] = "-1px";
        $menu.style.display = "block";

        scrollToMenuItem($menu.querySelector("li > button.active")?.parentElement);
    }

    function isFilterTextChanged(input: any) {
        return input.dataset.filterText
            && (!input.value || !input.value.toLowerCase().includes(input.dataset.filterText));
    }

    function filterMenuItems($input: any) {
        const $root = $input.parentElement;
        const $menu = $root.querySelector(".dropdown-menu");

        if ($menu.offsetWidth === 0 && $menu.offsetHeight === 0) {
            showDropDownMenu($root);
        }

        const text = $input.value?.toLowerCase();

        $input.dataset.filterText = text;

        $menu.querySelector("li > button.active")?.classList.remove("active");

        const list = $menu.querySelectorAll("li > button");
        for (let i = 0; i < list.length; i++) {
            const $a = list[i];
            const optionText = $a.innerHTML;
            const selected = !text || text.length === 0 || optionText.toLowerCase().includes(text);

            $a.parentElement.style.display = selected ? "block" : "none";
        }
    }

    function moveUp($menu: any) {
        const items = Array.from($menu.querySelectorAll("li"));

        let activeIndex = items.findIndex((x: any) => x.querySelector("button.active"));
        let $prev: any;

        if (activeIndex < 0) {
            $prev = items.find((x: any) => x.offsetWidth > 0 || x.offsetHeight > 0);
        } else {
            do {
                activeIndex--;
                $prev = activeIndex >= 0 ? items[activeIndex] : null;
            } while ($prev && $prev.offsetWidth === 0 && $prev.offsetHeight === 0);
        }

        if ($prev) {
            selectMenuItem($prev);
        }
    }

    function moveDown($menu: any) {
        const items = Array.from($menu.querySelectorAll("li"));

        let activeIndex = items.findIndex((x: any) => x.querySelector("button.active"));
        let $next: any;

        if (activeIndex < 0) {
            $next = items.find((x: any) => x.offestWidth > 0 || x.offsetHeight > 0);
        } else {
            do {
                activeIndex++;
                $next = activeIndex < items.length ? items[activeIndex] : null;
            } while ($next && $next.offsetWidth === 0 && $next.offsetHeight === 0);
        }

        if ($next) {
            selectMenuItem($next);
        }
    }

    function selectMenuItem($item: any) {
        const $menu = $item.parentElement;
        const list = $menu.querySelectorAll("li > button");

        for (const $item of list) {
            $item.classList.remove("active");
        }

        const $button = $item.querySelector("button");

        $button.classList.add("active");

        scrollToMenuItem($item);

        const text = $button.innerHTML;
        const $input = $menu.parentElement.querySelector("input");

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set;
        nativeInputValueSetter!.call($input, text);

        $input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function scrollToMenuItem($item: any) {
        if (!$item) {
            return;
        }

        const $menu = $item.parentElement;
        const menuHeight = $menu.offsetHeight;
        const itemHeight = $item.offsetHeight;
        const itemTop = $item.offsetTop - $menu.scrollTop;

        if (itemTop >= 0 && itemTop < menuHeight - itemHeight) {
            return;
        }

        let scrollTop = $menu.scrollTop + itemTop;

        if (itemTop > 0 || itemTop + itemHeight < 0) {
            scrollTop += itemHeight - menuHeight
        }

        $menu.scrollTo({ top: scrollTop });
    }

    return (
        <div className={`input-group custom-selector${className ? " " + className : ""}`}>
            <FormControl
                ref={ref}
                name={name}
                type="text"
                title={title}
                defaultValue={defaultValue}
                value={value}
                maxLength={maxLength}
                disabled={disabled === true}
                autoComplete="off"
                isInvalid={isInvalid}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                onKeyUp={handleInputKeyUp}
                onChange={onChange}
            />
            <button
                type="button"
                className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
                aria-expanded="false"
                tabIndex={-1}
                disabled={disabled}
                onClick={handleButtonClick}
            >
                <span className="caret"></span>
            </button >
            <ul className="dropdown-menu dropdown-menu-right">
                {items?.map(s => (
                    <li key={s}>
                        <button
                            className={`dropdown-item${stringHelper.equalsIgnoringCase(s, value || "") ? " active": ""}`}
                            tabIndex={-1}
                        >
                            {s}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
})

export default SearchSelector;