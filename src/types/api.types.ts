export interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    statusCode: number;
    data: T;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface PaginatedEnvelope<T> extends ApiEnvelope<T[]> {
    meta: PaginationMeta;
}
