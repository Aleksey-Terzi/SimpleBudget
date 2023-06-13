export interface PaginationData {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    pagesPerSection: number;
    id?: number;
}

export class PaginatedResponse<T> {
    items: T;
    paginationData: PaginationData;

    constructor(items: T, paginationData: PaginationData) {
        this.items = items;
        this.paginationData = paginationData;
    }
}