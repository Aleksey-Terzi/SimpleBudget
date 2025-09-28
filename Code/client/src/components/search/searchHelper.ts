import { PaginationData } from "@/api/models/PaginationData";
import { dateHelper } from "@/helpers/date/dateHelper";
import { isDate } from "@/helpers/date/dateTypes";

interface FilterProps {
    [key: string]: unknown | null;
}

export const searchHelper = {
    serializeParams(pageIndex: number, criteria: object | null): string {
        const searchParams = new URLSearchParams();
        if (pageIndex > 0) {
            searchParams.set("page", String(pageIndex + 1));
        }
        if (criteria !== null) {
            for (const key in criteria) {
                const value = (criteria as FilterProps)[key];
                if (!value) {
                    continue;
                }

                let text: string;
                let suffix: string;

                if (typeof value === "string") {
                    suffix = "S";
                    text = value;
                } else if (typeof value === "number") {
                    suffix = "N";
                    text = String(value);
                } else if (isDate(value)) {
                    suffix = "D";
                    text = dateHelper.format(value, "yyyy-mm-dd");
                } else {
                    throw new Error(`Unsupported value for ${key}: ${value}`);
                }

                searchParams.set(key + suffix, text);
            }
        }
        return searchParams.toString();
    },

    deserializeCriteria(defaultCriteria: object, searchParams: URLSearchParams): object | null {
        let isFilterFound = false;
        const criteria = {...defaultCriteria} as FilterProps;

        for (const key of searchParams.keys()) {
            const value = searchParams.get(key);
            const fieldName = key.length > 1 ? key.substring(0, key.length - 1) : null;

            if (!value || !fieldName || !(fieldName in criteria)) {
                continue;
            }

            const suffix = key[key.length - 1];

            isFilterFound = true;

            switch (suffix) {
                case "S":
                    criteria[fieldName] = value;
                    break;
                case "N":
                    criteria[fieldName] = Number(value);
                    break;
                case "D":
                    criteria[fieldName] = dateHelper.parse(value, "yyyy-mm-dd");
                    break;
                default:
                    throw new Error(`Unsupported filter value type for '${key}'='${value}'`);
            }
        }

        if (!isFilterFound) {
            return null;
        }

        return criteria;
    },

    toSearchResult<RowSrc extends object, RowDst extends object>(
        rows: RowSrc[],
        pagination: PaginationData,
        mapper: (row: RowSrc) => RowDst,
        sumRow?: RowDst | null
    ) {
        const rowsDst = rows.map(mapper);

        if (sumRow) {
            rowsDst.splice(0, 0, sumRow);
        }

        return {
            pageIndex: pagination.page - 1,
            rows: rowsDst,
            totalRowCount: pagination.totalItems,
            rowsPerPage: pagination.pageSize,
            pagesPerView: pagination.pagesPerSection,
        };
    }
}