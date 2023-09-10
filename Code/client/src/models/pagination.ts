export interface PaginationData {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    pagesPerSection: number;
    id?: number;
}

export class PaginatedResponse<T> {
    items: T[];
    valueFormat?: string;
    paginationData: PaginationData;

    constructor(data: any, paginationData: PaginationData) {
        if (data?.valueFormat) {
            this.items = data.items as T[];
            this.valueFormat = data.valueFormat;
        } else {
            this.items = data as T[];
        }

        this.paginationData = paginationData;
    }
}