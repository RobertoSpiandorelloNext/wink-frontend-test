import type { RouteObject } from 'react-router';

import { Layout } from './components/Layout';
import { NotFoundPage } from './components/NotFoundPage';
import { BookDetailPage } from './features/book/BookDetailPage';
import { SearchPage } from './features/search/SearchPage';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <SearchPage /> },
      { path: 'books/:bookId', element: <BookDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
