import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { SearchStorageKey } from "@/helpers/enums";
import { useLoadingProvider } from "../../contexts/LoadingProvider";
import { useStatusProvider } from "../../contexts/StatusProvider";
import { useSearchDefaults } from "./useSearchDefaults";

export interface SearchContextData<Criteria extends object, Row extends object> {
    expanded: boolean;
    pageIndex: number;
    criteria: Criteria;
    defaultCriteria: Criteria;
    rows: Row[] | null;
    totalRowCount: number;
    rowsPerPage: number;
    isLoading: boolean;
    setPageIndex: (pageIndex: number) => void;
    setCriteria: (criteria: Criteria) => void;
    setExpanded: (expanded: boolean) => void;
}

const SearchContext = createContext<SearchContextData<object, object>>({
    expanded: false,
    pageIndex: -1,
    criteria: {},
    defaultCriteria: {},
    rows: null,
    totalRowCount: -1,
    rowsPerPage: -1,
    isLoading: false,
    setPageIndex: () => {},
    setCriteria: () => {},
    setExpanded: () => {},
});

interface Props<Criteria extends object, Row extends object> {
    storageKey?: SearchStorageKey;
    defaultCriteria: Criteria;
    children?: ReactNode;
    onLoad: (pageIndex: number, criteria: Criteria, contextData: SearchContextData<Criteria, Row> | null) => Promise<{
        pageIndex: number;
        rows: Row[];
        totalRowCount: number;
        rowsPerPage: number;
    }>;
}

export default function Search<Criteria extends object, Row extends object>({
    storageKey,
    defaultCriteria,
    children,
    onLoad,
}: Props<Criteria, Row>)
{
    const defaults = useSearchDefaults<Criteria, Row>(storageKey, defaultCriteria);

    const [pageIndex, setPageIndex] = useState(-1);
    const [criteria, setCriteria] = useState(defaultCriteria);
    const [expanded, setExpanded] = useState(defaults.expanded);

    const [contextData, setContextData] = useState<SearchContextData<Criteria, Row>>({
        expanded: defaults.expanded,
        pageIndex: defaults.pageIndex,
        criteria: defaults.criteria,
        defaultCriteria,
        rows: defaults.rows,
        totalRowCount: defaults.totalRowCount,
        rowsPerPage: defaults.rowsPerPage,
        isLoading: false,
        setPageIndex,
        setCriteria,
        setExpanded,
    });

    const { addError, removeError } = useStatusProvider();
    const { addLoading, removeLoading } = useLoadingProvider();

    const load = useCallback(async (loadPageIndex: number, loadCriteria: Criteria, loadContextData: SearchContextData<Criteria, Row> | null) => {
        const { pageIndex: newPageIndex, rows, totalRowCount, rowsPerPage } = await onLoad(loadPageIndex, loadCriteria, loadContextData);

        setPageIndex(newPageIndex);
        setCriteria(loadCriteria);

        setContextData(prev => ({
            expanded: prev.expanded,
            pageIndex: newPageIndex,
            criteria: loadCriteria,
            defaultCriteria: prev.defaultCriteria,
            rows,
            totalRowCount,
            rowsPerPage,
            isLoading: false,
            setPageIndex,
            setCriteria,
            setExpanded
        }));

        defaults.setData(
            newPageIndex,
            loadCriteria,
            rows,
            totalRowCount,
            rowsPerPage
        );
    }, [onLoad, defaults]);

    // Init load
    useEffect(() => {
        if (defaults.rows) {
            setPageIndex(defaults.pageIndex);
            setCriteria(defaults.criteria);
            defaults.setSearchParams();
            return;
        }

        run();

        async function run() {
            addLoading();

            try {
                await load(defaults.pageIndex, defaults.criteria, null);
                removeError();
            } catch (e) {
                addError(e, "Search grid failed to load");
            }

            removeLoading();
        };
    }, [addLoading, removeLoading, addError, removeError, load, defaults]);

    // Load on search or change page
    useEffect(() => {
        if (pageIndex < 0
            || contextData.isLoading
            || pageIndex === contextData.pageIndex && criteria === contextData.criteria
        ) {
            return;
        }

        const newPageIndex = criteria === contextData.criteria ? pageIndex : 0;

        setContextData({...contextData, isLoading: true});

        run();

        async function run () {
            try {
                await load(newPageIndex, criteria, contextData);
                removeError();
            } catch (e) {
                addError(e, "Search grid failed to load");
                setContextData({...contextData, isLoading: false});
                setPageIndex(contextData.pageIndex);
                setCriteria(contextData.criteria);
            }
        }
    }, [load, addError, removeError, pageIndex, criteria, contextData]);

    useEffect(() => {
        setContextData(prev => {
            return prev.expanded === expanded
                ? prev
                : {
                    ...prev,
                    expanded
                };
        });
        defaults.setExpanded(expanded);
    }, [expanded, defaults]);

    return (
        <SearchContext.Provider value={contextData as unknown as SearchContextData<object, object>}>
            {children}
        </SearchContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSearch<Filter extends object, Row extends object>(): SearchContextData<Filter, Row> {
    return useContext(SearchContext) as unknown as SearchContextData<Filter, Row>;
}