import { ReactNode, useEffect, useState } from "react";
import ExpandablePanel from "../ExpandablePanel";
import Icon from "../Icon";
import { useSearch } from "./Search";

interface Props {
    children? : ReactNode;
    excludeFilterPropsInCount?: string[];
    onShow?: () => void;
}

interface FilterProps {
    [key: string]: unknown | null;
}

function countValues(filter: object | null, excludeFilterPropsInCount: string[] | null) {
    if (filter === null) {
        return 0;
    }
    let count = 0;
    for (const key in filter) {
        const value = (filter as FilterProps)[key];
        if (value !== null
            && (typeof value !== "string" || value.length > 0)
            && (!excludeFilterPropsInCount || !excludeFilterPropsInCount.includes(key))
        ) {
            count++;
        }
    }
    return count;
}

export default function SearchCriteria({ children, excludeFilterPropsInCount, onShow }: Props) {
    const { expanded, setExpanded, criteria: filter } = useSearch();
    const [count, setCount] = useState(() => countValues(filter, excludeFilterPropsInCount ?? null));

    useEffect(() => {
        setCount(countValues(filter, excludeFilterPropsInCount ?? null));
    }, [filter, excludeFilterPropsInCount]);

    return (
        <ExpandablePanel title={(
                <div className="flex items-center">
                    <Icon icon="search" className="me-2" />
                    <div>
                        <span className="font-semibold">Search</span>
                        {count > 0 && (
                            <span className="ms-4">
                                ({count === 1 ? "1 filter set" : `${count} filters set`})
                            </span>
                        )}
                    </div>
                </div>
            )}
            defaultExpanded={expanded}
            onChange={expanded => {
                if (expanded && onShow) {
                    onShow();
                }
                setExpanded(expanded);
            }}
        >
            {children}
        </ExpandablePanel>
    );
}