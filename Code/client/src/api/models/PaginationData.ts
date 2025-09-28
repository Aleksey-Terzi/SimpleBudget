export interface PaginationData {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    pagesPerSection: number;
    id: number | undefined | null;
}