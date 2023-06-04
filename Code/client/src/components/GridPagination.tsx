import { Link } from "react-router-dom";
import { PaginationData } from "../models/pagination";

interface Props {
    filterParams: string;
    paginationData: PaginationData;
}

export default function GridPagination({ filterParams, paginationData }: Props) {
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
                {i === paginationData.page ? (
                    <span className="page-link">
                        {i}
                    </span>
                ) : (
                    <Link className="page-link" to={`?page=${i}${filterParams}`}>
                        {i}
                    </Link>
                )}
            </li >
        ));
    }

    return (
        <div className="row">
            <div className="col-md-9">
                <nav aria-label="...">
                    <ul className="pagination">
                        {section > 1 && (
                            <li className="page-item">
                                <Link className="page-link" to={`?page=${startPageInSection - 1}${filterParams}`}>...</Link>
                            </li>
                        )}

                        {pages}

                        {section < sectionCount && (
                            <li className="page-item">
                                <Link className="page-link" to={`?page=${endPageInSection + 1}${filterParams}`}>...</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
            <div className="col-md-3 text-end">
                <strong>
                    Page {paginationData.page} of {paginationData.totalPages} - Items {startItem} to {endItem} of {paginationData.totalItems}
                </strong>
            </div>
        </div>
    );
}