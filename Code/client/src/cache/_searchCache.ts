import { SearchStorageKey } from "@/helpers/enums";
import { storageHelper } from "@/helpers/storageHelper";

interface SearchData {
    pageIndex: number;
    criteria: object;
    rows: object[] | null;
    totalRowCount: number;
    rowsPerPage: number;
}

const _data: Map<SearchStorageKey, SearchData> = new Map();

export const _searchCache = {
    setExpanded(storageKey: SearchStorageKey, expanded: boolean) {
        storageHelper.set("searches", storageKey, "expanded", expanded ? "1" : null);
    },

    setData(storageKey: SearchStorageKey, search: SearchData) {
        _data.set(storageKey, search);
    },

    get<Criteria, Row>(storageKey: SearchStorageKey) {
        const storedData = _data.get(storageKey);
        const expanded = storageHelper.get("searches", storageKey, "expanded");

        const data = storedData
            ? {
                ...storedData,
                criteria: storedData.criteria as Criteria,
                rows: storedData.rows as Row[],
            }: null;

        return {
            expanded: expanded === "1",
            data
        };
    },

    delete(storageKey: SearchStorageKey) {
        _data.delete(storageKey);
    },
}