import { PAGE_SIZES, type PageSize } from '../../services/googleBooksApi';

export const DEFAULT_PAGE_SIZE: PageSize = 10;

/** What is being searched. It lives in the URL: ?q=dune&page=2&size=20 */
export interface SearchState {
  /** The search text, without surrounding spaces; empty when nothing is searched. */
  query: string;
  page: number;
  pageSize: PageSize;
}

export function isPageSize(value: number): value is PageSize {
  return (PAGE_SIZES as readonly number[]).includes(value);
}

/** Reads the search from the URL. Invalid or missing values fall back to the defaults. */
export function parseSearchParams(params: URLSearchParams): SearchState {
  const page = Number(params.get('page'));
  const size = Number(params.get('size'));
  return {
    query: (params.get('q') ?? '').trim(),
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    pageSize: isPageSize(size) ? size : DEFAULT_PAGE_SIZE,
  };
}

/** The inverse of parseSearchParams. Defaults are left out to keep URLs short. */
export function toSearchParams({ query, page, pageSize }: SearchState): URLSearchParams {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  if (pageSize !== DEFAULT_PAGE_SIZE) params.set('size', String(pageSize));
  return params;
}
