import { configureStore } from '@reduxjs/toolkit';

import { googleBooksApi } from '../services/googleBooksApi';

/**
 * The store only holds the RTK Query cache. The search itself (text, page, page size) lives in the
 * URL, so it survives reloads, can be shared and works with the browser's back button.
 */
export function makeStore() {
  return configureStore({
    reducer: { [googleBooksApi.reducerPath]: googleBooksApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(googleBooksApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
