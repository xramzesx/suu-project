type PaginatedResponse<T> = {
  data: T[];
  pageNo: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  currentPageSize: number;
};

export type { PaginatedResponse };
