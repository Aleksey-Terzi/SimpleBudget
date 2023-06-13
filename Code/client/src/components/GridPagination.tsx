import { Link } from "react-router-dom";
import { PaginationData } from "../models/pagination";

export interface PageClickEvent {
    page: number;
}

interface Props {
    paginationData: PaginationData;
    disabled?: boolean;
    filterParams?: string;
    pageClick?: (e: PageClickEvent) => void;
}

export default function GridPagination({ paginationData, disabled, filterParams, pageClick }: Props) {
    const startItem = (paginationData.page - 1) * paginationData.pageSize + 1;
    const section = Math.floor((paginationData.page - 1) / paginationData.pagesPerSection) + 1;

    let endItem = paginationData.page * paginationData.pageSize;
    if (endItem > paginationData.totalItems) {
        endItem = paginationData.totalItems;
    }

    let sectionCount = Math.floor(paginationData.totalPages / paginationData.pagesPerSection);
    if ((paginationData.totalPages % paginationData.pagesPerSection) !== 0) {
        sectionCount++;
    }

    const startPageInSection = (section - 1) * paginationData.pagesPerSection + 1;

    let endPageInSection = section * paginationData.pagesPerSection;
    if (endPageInSection > paginationData.totalPages) {
        endPageInSection = paginationData.totalPages;
    }

    const pages = [];
    for (let i = startPageInSection; i <= endPageInSection; i++)
    {
        const itemClass = `page-item${i === paginationData.page ? " active": ""}`;

        pages.push((
            <li key={i} className={itemClass} >
                {i === paginationData.page || disabled ? (
                    <span className="page-link">
                        {i}
                    </span>
                ) : pageClick ? (
                        <button className="page-link" onClick={() => pageClick({ page: i })}>
                            {i}
                        </button>
                    ) : (
                        <Link className="page-link" to={`?page=${i}${filterParams}`}>
                            {i}
                        </Link>
                    )
                }
            </li >
        ));
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <nav aria-label="...">
                    <ul className="pagination">
                        {section > 1 && (
                            <li className="page-item">
                                {disabled ? (
                                    <span className="page-link">
                                        ...
                                    </span>
                                ) : pageClick ? (
                                    <button className="page-link" onClick={() => pageClick({ page: startPageInSection - 1 })}>
                                        ...
                                    </button>
                                ) : (
                                    <Link className="page-link" to={`?page=${startPageInSection - 1}${filterParams}`}>...</Link>
                                )}
                            </li>
                        )}

                        {pages}

                        {section < sectionCount && (
                            <li className="page-item">
                                {disabled ? (
                                    <span className="page-link">
                                        ...
                                    </span>
                                ): pageClick ? (
                                    <button className="page-link" onClick={() => pageClick({ page: endPageInSection + 1 })}>
                                        ...
                                    </button>
                                ): (
                                    <Link className="page-link" to={`?page=${endPageInSection + 1}${filterParams}`}>...</Link>
                                )}
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
            <div className="col-md-6 text-end">
                <strong>
                    {paginationData.totalItems > 0 && (
                        <>Page {paginationData.page} of {paginationData.totalPages} - Items {startItem} to {endItem} of {paginationData.totalItems}</>
                    )}
                </strong>
            </div>
        </div>
    );
}