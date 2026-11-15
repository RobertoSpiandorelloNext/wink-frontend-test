import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type QueryError = FetchBaseQueryError | SerializedError | undefined;

export function isNotFound(error: QueryError): boolean {
  return error !== undefined && 'status' in error && error.status === 404;
}

/** A message for people, based on what went wrong with a request. */
export function describeError(error: QueryError): string {
  if (error && 'status' in error) {
    if (error.status === 429) {
      return 'Google Books has received too many requests and is not answering right now. Please try again later.';
    }
    if (error.status === 'FETCH_ERROR') {
      return 'Google Books could not be reached. Check your connection and try again.';
    }
    if (typeof error.status === 'number' && error.status >= 500) {
      return 'Google Books is having problems right now. Please try again in a moment.';
    }
  }
  return 'Something went wrong while loading the data. Please try again.';
}
