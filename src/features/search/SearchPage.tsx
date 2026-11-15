import { Link } from 'react-router';

import { ErrorAlert } from '../../components/ErrorAlert';
import { Paginator } from '../../components/Paginator';
import { describeError } from '../../lib/errors';
import { getPageCount } from '../../lib/pagination';
import { googleBooksApi, useSearchBooksQuery } from '../../services/googleBooksApi';
import { BookList } from './BookList';
import { PageSizeSelect } from './PageSizeSelect';
import { ResultsSkeleton } from './ResultsSkeleton';
import { SearchBar } from './SearchBar';
import { useSearchInput } from './useSearchInput';
import { useSearchState } from './useSearchState';

/** Results follow the typing, once it pauses this long, so a fast typist does not send one request per key. */
const SEARCH_DELAY_MS = 300;

const numberFormat = new Intl.NumberFormat('en-US');

export function SearchPage() {
  const { query, page, pageSize, setQuery, setPageSize, hrefForPage } = useSearchState();
  const [input, setInput] = useSearchInput(query, setQuery, SEARCH_DELAY_MS);
  const prefetchSearch = googleBooksApi.usePrefetch('searchBooks');

  const { data, error, isError, isFetching, refetch } = useSearchBooksQuery(
    { query, page, pageSize },
    { skip: query === '' },
  );

  const renderResults = () => {
    if (query === '') {
      return (
        <p className="text-body-secondary text-center py-5 mb-0">
          Start typing to search millions of books on Google Books.
        </p>
      );
    }
    if (isError) {
      return (
        <ErrorAlert
          message={describeError(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      );
    }
    if (!data) {
      return <ResultsSkeleton count={pageSize} />;
    }

    const books = data.items ?? [];
    if (data.totalItems === 0) {
      return (
        <p className="text-center py-5 mb-0" role="status">
          No books found for <strong>{query}</strong>.
        </p>
      );
    }
    if (books.length === 0) {
      // Google's total is an estimate: pages near the end can turn out to be empty.
      return (
        <p className="text-center py-5 mb-0" role="status">
          There are no more results on this page.{' '}
          <Link to={hrefForPage(1)}>Go to the first page</Link>
        </p>
      );
    }

    const first = (page - 1) * pageSize + 1;
    const last = first + books.length - 1;
    return (
      <div className={isFetching ? 'results is-stale' : 'results'} aria-busy={isFetching}>
        <p className="text-body-secondary small mb-3" role="status">
          Showing {numberFormat.format(first)} to {numberFormat.format(last)} of about{' '}
          {numberFormat.format(data.totalItems)} results
        </p>
        <BookList books={books} />
        <Paginator
          page={page}
          pageCount={getPageCount(data.totalItems, pageSize)}
          hrefForPage={hrefForPage}
          onPageIntent={(target) => {
            prefetchSearch({ query, page: target, pageSize });
          }}
        />
      </div>
    );
  };

  return (
    <>
      <title>{query ? `${query} - Book Search` : 'Book Search'}</title>
      <h1 className="visually-hidden">Search books</h1>
      <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center mb-4">
        <SearchBar
          value={input}
          onChange={setInput}
          onSubmit={() => {
            if (input.trim() !== query) {
              setQuery(input.trim());
            }
          }}
          isBusy={isFetching}
        />
        <PageSizeSelect value={pageSize} onChange={setPageSize} />
      </div>
      {renderResults()}
    </>
  );
}
