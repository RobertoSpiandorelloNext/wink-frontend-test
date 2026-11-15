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
        <p className="py-16 text-center text-base-content/70">
          Start typing to search millions of books on Google Books.
        </p>
      );
    }
    // Google's totals are estimates: a later page can come back empty, and a page far beyond
    // the results it really serves is refused with a 400.
    const endOfResults = (
      <output className="block py-16 text-center">
        There are no more results on this page.{' '}
        <Link to={hrefForPage(1)} className="link">
          Go to the first page
        </Link>
      </output>
    );

    if (isError) {
      if (page > 1 && 'status' in error && error.status === 400) {
        return endOfResults;
      }
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
    if (books.length === 0) {
      return page > 1 ? (
        endOfResults
      ) : (
        <output className="block py-16 text-center">
          No books found for <strong>{query}</strong>.
        </output>
      );
    }

    const first = (page - 1) * pageSize + 1;
    const last = first + books.length - 1;
    return (
      // While the next page or search loads, the current results stay visible but dimmed.
      <div
        className={`transition-opacity motion-reduce:transition-none ${isFetching ? 'opacity-50' : ''}`}
        aria-busy={isFetching}
      >
        <output className="mb-3 block text-sm text-base-content/70">
          Showing {numberFormat.format(first)} to {numberFormat.format(last)} of about{' '}
          {numberFormat.format(data.totalItems)} results
        </output>
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
      <h1 className="sr-only">Search books</h1>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
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
