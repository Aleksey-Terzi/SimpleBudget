import { ReactNode } from "react";
import { useSearch } from "./Search";
import Grid, { GridColumn } from "../Grid";

interface Props<Row> {
    columns: GridColumn[];
    children?: (row: Row) => ReactNode | null;
}

const _pagesPerView = 10;

export default function SearchResult<Row extends object>({ columns, children }: Props<Row>) {
    const {
        pageIndex,
        totalRowCount,
        rows,
        rowsPerPage,
        isLoading,
        setPageIndex
    } = useSearch<object, Row>();

    return (
        <Grid
            className="mt-3"
            columns={columns}
            pageIndex={rows ? pageIndex : undefined}
            totalRowCount={totalRowCount}
            pagesPerView={_pagesPerView}
            rowsPerPage={rowsPerPage}
            isLoading={isLoading}
            onGoToPage={pageIndex => setPageIndex(pageIndex)}
        >
            {rows && (
                rows.length > 0 && children 
                    ? rows.map(children)
                    : (
                        <tr>
                            <td colSpan={columns.length}>
                                <em>No Data</em>
                            </td>
                        </tr>
                    )
            )}
            {!rows && (
                <tr>
                    <td colSpan={columns.length}>
                        Data is loading...
                    </td>
                </tr>
            )}
        </Grid>
    );
}