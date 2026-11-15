import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import type { Volume } from '../services/googleBooks.types';
import { makeCatalog, makeVolume } from './fixtures';

export const API = 'https://www.googleapis.com/books/v1/volumes';

/** Search results by query. Anything else returns no books, like the real API. */
export const catalogs: Record<string, Volume[]> = {
  dune: makeCatalog('dune', 47),
  dun: makeCatalog('dun', 3),
};

/** Books served by the detail endpoint, by id. */
export const books = new Map<string, Volume>([
  ['dune-1', makeVolume('dune-1', { title: 'Dune', publisher: 'Chilton Books', pageCount: 412 })],
]);

/** Every search request the app sent during the current test, in order. */
export const searchRequests: URL[] = [];

export const handlers = [
  http.get(API, ({ request }) => {
    const url = new URL(request.url);
    searchRequests.push(url);
    const query = url.searchParams.get('q') ?? '';
    if (query === '') {
      return HttpResponse.json(
        { error: { code: 400, message: 'Missing query.' } },
        { status: 400 },
      );
    }
    const start = Number(url.searchParams.get('startIndex') ?? 0);
    const size = Number(url.searchParams.get('maxResults') ?? 10);
    const catalog = catalogs[query] ?? [];
    const items = catalog.slice(start, start + size);
    return HttpResponse.json(
      items.length > 0 ? { totalItems: catalog.length, items } : { totalItems: catalog.length },
    );
  }),
  http.get(`${API}/:id`, ({ params }) => {
    const book = books.get(String(params.id));
    return book
      ? HttpResponse.json(book)
      : HttpResponse.json(
          { error: { code: 404, message: 'The volume ID could not be found.' } },
          { status: 404 },
        );
  }),
];

export const server = setupServer(...handlers);
