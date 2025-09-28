import { cache } from "@/cache/cache";
import { SearchStorageKey } from "@/helpers/enums";
import { numberHelper } from "@/helpers/numberHelper";
import { useState } from "react";
import { searchHelper } from "./searchHelper";

interface Defaults<Criteria, Row> {
    expanded: boolean;
    pageIndex: number;
    criteria: Criteria; 
    rows: Row[] | null;
    totalRowCount: number;
    rowsPerPage: number;
    setExpanded: (expanded: boolean) => void;
    setData: (
        pageIndex: number,
        criteria: Criteria,
        rows: Row[],
        totalRowCount: number,
        rowsPerPage: number,
    ) => void;
    setSearchParams: () => void;
}

export function useSearchDefaults<Criteria extends object, Row extends object>(
    storageKey: SearchStorageKey | undefined | null,
    defaultCriteria: Criteria,
): Defaults<Criteria, Row> {
    const [defaults] = useState(() => {
        const { expanded, data } = getSearch<Criteria, Row>(storageKey, defaultCriteria);
        return {
            expanded,
            pageIndex: data?.pageIndex ?? 0,
            criteria: data?.criteria ?? defaultCriteria,
            rows: data?.rows ?? null,
            totalRowCount: data?.totalRowCount ?? 0,
            rowsPerPage: data?.rowsPerPage ?? 0,
            
            setExpanded(expanded: boolean) {
                if (storageKey) {
                    cache.search.setExpanded(storageKey, expanded);
                }
            },

            setData(
                pageIndex: number,
                criteria: Criteria,
                rows: Row[],
                totalRowCount: number,
                rowsPerPage: number,
            ) {
                if (storageKey) {
                    cache.search.setData(storageKey, {
                        pageIndex,
                        criteria,
                        rows,
                        totalRowCount,
                        rowsPerPage,
                    });
                }
                const searchParams = searchHelper.serializeParams(pageIndex, criteria);
                window.history.replaceState(null, "", window.location.pathname + (searchParams ? "?" + searchParams : "" ));
            },

            setSearchParams() {
                const searchParams = searchHelper.serializeParams(this.pageIndex, this.criteria);
                window.history.replaceState(null, "", window.location.pathname + (searchParams ? "?" + searchParams : "" ));
            }
        };
    });
    return defaults;
}

function getSearch<Criteria extends object, Row>(
    storageKey: SearchStorageKey | undefined | null,
    defaultCriteria: Criteria,
) {
    const search = storageKey ? cache.search.get<Criteria, Row>(storageKey) : null;

    const searchParams = new URLSearchParams(window.location.search);
    
    const pageNumber: number | null = numberHelper.parseInt(searchParams.get("page"));
    const criteria = defaultCriteria ? searchHelper.deserializeCriteria(defaultCriteria, searchParams) as Criteria : null;

    if (pageNumber === null && !criteria && search?.data) {
        return search;
    }

    return {
        expanded: search !== null && search.expanded,
        data: {
            pageIndex: pageNumber !== null && pageNumber >= 1 ? pageNumber - 1 : 0,
            criteria,
            rows: null,
            totalRowCount: 0,
            rowsPerPage: 0,
        }
    };
}