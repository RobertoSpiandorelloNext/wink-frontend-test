import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

import type { Volume, VolumeList } from './googleBooks.types';

export const PAGE_SIZES = [5, 10, 15, 20] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export interface SearchArgs {
  /** Already trimmed and never empty: the API rejects an empty query. */
  query: string;
  /** 1-based page number. */
  page: number;
  pageSize: PageSize;
}

const API_URL = 'https://www.googleapis.com/books/v1/';
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

// Partial responses: only the fields the screens render are transferred.
const LIST_FIELDS =
  'totalItems,items(id,volumeInfo(title,subtitle,authors,publishedDate,description,imageLinks))';
const DETAIL_FIELDS =
  'id,volumeInfo(title,subtitle,authors,publisher,publishedDate,description,pageCount,categories,' +
  'language,imageLinks,infoLink,industryIdentifiers,averageRating,ratingsCount)';

function withApiKey(params: Record<string, string | number>): Record<string, string | number> {
  return API_KEY ? { ...params, key: API_KEY } : params;
}

const rawBaseQuery = fetchBaseQuery({ baseUrl: API_URL });

/**
 * Retries network failures and server errors with exponential backoff. Client errors are final:
 * a bad request will not get better, and retrying a 429 would only burn more quota.
 */
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    const status = result.error?.status;
    if (typeof status === 'number' && status < 500) {
      retry.fail(result.error, result.meta);
    }
    return result;
  },
  { maxRetries: 2 },
);

export const googleBooksApi = createApi({
  reducerPath: 'googleBooksApi',
  baseQuery,
  // Results stay cached for five minutes, so going back to a previous page or search is instant.
  keepUnusedDataFor: 300,
  refetchOnReconnect: true,
  endpoints: (build) => ({
    searchBooks: build.query<VolumeList, SearchArgs>({
      query: ({ query, page, pageSize }) => ({
        url: 'volumes',
        params: withApiKey({
          q: query,
          startIndex: (page - 1) * pageSize,
          maxResults: pageSize,
          fields: LIST_FIELDS,
        }),
      }),
    }),
    getBook: build.query<Volume, string>({
      query: (id) => ({
        url: `volumes/${encodeURIComponent(id)}`,
        params: withApiKey({ fields: DETAIL_FIELDS }),
      }),
    }),
  }),
});

export const { useSearchBooksQuery, useGetBookQuery } = googleBooksApi;
