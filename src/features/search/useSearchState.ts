import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { PageSize } from '../../services/googleBooksApi';
import { parseSearchParams, toSearchParams, type SearchState } from './searchParams';

export interface SearchStateApi extends SearchState {
  /** A new search starts from the first page. It replaces the history entry, so typing does not fill the history. */
  setQuery: (query: string) => void;
  setPageSize: (pageSize: PageSize) => void;
  /** The URL of a page of the current search, for links. */
  hrefForPage: (page: number) => string;
}

/** The search state, backed by the URL query string. */
export function useSearchState(): SearchStateApi {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = useMemo(() => parseSearchParams(searchParams), [searchParams]);

  const update = useCallback(
    (changes: Partial<SearchState>, options?: { replace?: boolean }) => {
      setSearchParams(
        (current) => toSearchParams({ ...parseSearchParams(current), ...changes }),
        options,
      );
    },
    [setSearchParams],
  );

  const setQuery = useCallback(
    (query: string) => {
      update({ query, page: 1 }, { replace: true });
    },
    [update],
  );

  const setPageSize = useCallback(
    (pageSize: PageSize) => {
      update({ pageSize, page: 1 });
    },
    [update],
  );

  const hrefForPage = useCallback(
    (page: number) => `?${toSearchParams({ ...state, page }).toString()}`,
    [state],
  );

  return { ...state, setQuery, setPageSize, hrefForPage };
}
