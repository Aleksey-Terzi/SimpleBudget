import { ReactNode } from "react";
import LoadingOverlay from "./LoadingOverlay";
import Pagination from "./Pagination";

export interface GridColumn {
    className?: string;
    title?: ReactNode;
}

interface Props {
    className?: string;
    columns?: GridColumn[];
    children?: ReactNode;
    pageIndex?: number;
    totalRowCount?: number;
    rowsPerPage?: number;
    pagesPerView?: number;
    hidePagingDescription?: boolean;
    isLoading?: boolean;
    onGoToPage?: (pageIndex: number) => void;
}

export default function Grid({
    className,
    columns,
    children,
    pageIndex,
    totalRowCount,
    rowsPerPage,
    pagesPerView,
    hidePagingDescription,
    isLoading,
    onGoToPage,
}: Props) {
    return (
        <table className={`
            w-full
            [&>thead>tr>th]:p-2
            [&>thead>tr]:border-t
            [&>thead>tr]:border-b [&>thead>tr]:border-gray-border
            [&>tbody>tr:last-child]:border-b [&>tbody>tr:last-child]:border-gray-border
            [&>tfoot>tr>td]:py-2
            [&>tbody>tr>td]:px-2 [&>tbody>tr>td]:py-1.5
            [&>tbody>tr:nth-child(odd)]:bg-gray-bg            
            [&>tbody>tr]:align-top
        ` + (className ? className : "")}>
            <thead>
                <tr>
                    {columns && columns.map(({ className, title }, index) => (
                        <th key={index} className={className}>{title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
            {columns && pageIndex !== undefined && totalRowCount !== undefined && onGoToPage && (
                <tfoot>
                    <tr>
                        <td colSpan={columns.length}>
                            <LoadingOverlay isLoading={isLoading}>
                                <Pagination
                                    pageIndex={pageIndex}
                                    rowsPerPage={rowsPerPage ?? 15}
                                    pagesPerView={pagesPerView ?? 10}
                                    totalRowCount={totalRowCount}
                                    hideDescription={hidePagingDescription}
                                    onGoToPage={onGoToPage}
                                />
                            </LoadingOverlay>
                        </td>
                    </tr>
                </tfoot>
            )}
        </table>
    );
}