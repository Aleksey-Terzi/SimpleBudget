import { SearchStorageKey } from "./enums";

type StorageCategory = "system" | "searches" | "reports";
type StorageKey = "api" | SearchStorageKey | "summary";
type ValueKey = "token" | "username" | "expanded" | "deductTaxes";

export const storageHelper = {
    set(category: StorageCategory, key: StorageKey, valueKey: ValueKey, value: string | null) {
        const fullKey = getFullStorageKey(category, key, valueKey);

        if (value) {
            localStorage.setItem(fullKey, value);
        } else {
            localStorage.removeItem(fullKey);
        }
    },

    get(category: StorageCategory, key: StorageKey, valueKey: ValueKey) {
        return localStorage.getItem(getFullStorageKey(category, key, valueKey));
    },
}

function getFullStorageKey(category: StorageCategory, key: StorageKey, valueKey: ValueKey) {
    return `${category}.${key}.${valueKey}`;
}