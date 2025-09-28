import { numberHelper } from "@/helpers/numberHelper";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/16/solid";

interface Props {
    pageIndex: number;
    rowsPerPage: number;
    pagesPerView: number;
    totalRowCount: number;
    hideDescription?: boolean;
    onGoToPage: (pageIndex: number) => void;
}

export default function Pagination({
    pageIndex,
    rowsPerPage,
    pagesPerView,
    totalRowCount,
    hideDescription,
    onGoToPage
}: Props) {
    const pageCount = Math.floor((totalRowCount - 1) / rowsPerPage) + 1;
    if (pageCount <= 1) {
        return;
    }

    if (pageIndex < 0) {
        pageIndex = 0;
    } else if (pageIndex >= pageCount) {
        pageIndex = pageCount - 1;
    }

    const firstRowNumber = pageIndex * rowsPerPage + 1;
    const lastRowNumber = firstRowNumber + rowsPerPage - 1 > totalRowCount ? totalRowCount : firstRowNumber + rowsPerPage - 1;

    const firstPageIndex = Math.floor(pageIndex / pagesPerView) * pagesPerView;

    let lastPageIndex = firstPageIndex + pagesPerView - 1;
    if (lastPageIndex >= pageCount) {
        lastPageIndex = pageCount - 1;
    }

    const pages = Array.from({ length: pagesPerView < pageCount - firstPageIndex ? pagesPerView : pageCount - firstPageIndex }, (_, i) => i + firstPageIndex);

    function handleGoToPage(newPageIndex: number) {
        onGoToPage(newPageIndex);
    }

    return (
        <nav aria-label="Grid Navigation" className="flex justify-between items-center text-main-text">
            <ul className="
                flex gap-1
                [&>li>button]:bg-white-bg [&>li>button]:text-center
                [&>li>button]:py-1.5
                [&>li>button]:border [&>li>button]:border-gray-border
                [&>li:first-child>button]:rounded-s-lg [&>li:last-child>button]:rounded-e-lg
                hover:[&>li>button]:bg-gray-hover
                data-[selected]:[&>li>button]:bg-blue-bg data-[selected]:[&>li>button]:text-contrast-text
            ">
                {firstPageIndex > 0 && (
                    <>
                        <li>
                            <button
                                type="button"
                                tabIndex={-1}
                                title="First Page"
                                className="h-full px-2"
                                onClick={() => handleGoToPage(0)}
                            >
                                <div className="w-4">
                                    <ChevronDoubleLeftIcon />
                                </div>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                tabIndex={-1}
                                className="px-2"
                                title="Previous Pages"
                                onClick={() => handleGoToPage(firstPageIndex - 1)}
                            >
                                ...
                            </button>
                        </li>
                    </>
                )}
                {pages.map(currentPageIndex => (
                    <li key={currentPageIndex}>
                        <button
                            type="button"
                            tabIndex={-1}
                            className="px-3"
                            title={currentPageIndex === pageIndex ? "Current Page" : `Go to Page #${currentPageIndex + 1}`}
                            data-selected={currentPageIndex === pageIndex ? true : undefined}
                            disabled={currentPageIndex === pageIndex}
                            onClick={() => handleGoToPage(currentPageIndex)}
                        >
                            {currentPageIndex + 1}
                        </button>
                    </li>
                ))}
                {(lastPageIndex < pageCount - 1) && (
                    <>
                        <li>
                            <button
                                type="button"
                                tabIndex={-1}
                                className="px-2"
                                title="Next Pages"
                                onClick={() => handleGoToPage(lastPageIndex + 1)}
                            >
                                ...
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                tabIndex={-1}
                                title="Last Page"
                                className="h-full px-2"
                                onClick={() => handleGoToPage(pageCount - 1)}
                            >
                                <div className="w-4">
                                    <ChevronDoubleRightIcon />
                                </div>
                            </button>
                        </li>
                    </>
                )}
            </ul>
            {!hideDescription && (
                <div>
                    Page <b>{numberHelper.formatInt(pageIndex + 1)}</b> of <b>{numberHelper.formatInt(pageCount)}</b>
                    &nbsp;-
                    Rows <b>{numberHelper.formatInt(firstRowNumber)}</b> to <b>{numberHelper.formatInt(lastRowNumber)}</b> of <b>{numberHelper.formatInt(totalRowCount)}</b>
                </div>
            )}
        </nav>
    );
}