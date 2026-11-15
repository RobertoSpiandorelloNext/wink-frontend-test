import { Link, useLocation, useParams } from 'react-router';

import { ErrorAlert } from '../../components/ErrorAlert';
import { describeError, isNotFound } from '../../lib/errors';
import { useGetBookQuery } from '../../services/googleBooksApi';
import { BookDetails } from './BookDetails';
import { getReturnPath } from './returnPath';

export function BookDetailPage() {
  const { bookId = '' } = useParams();
  const location = useLocation();
  // The book is loaded by id, so the page also works when opened from a link or reloaded.
  const { data: book, error, isError, refetch } = useGetBookQuery(bookId);

  const renderContent = () => {
    if (isError && isNotFound(error)) {
      return <output className="block py-16 text-center">This book could not be found.</output>;
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
    if (!book) {
      return (
        <div className="flex justify-center py-16">
          <output
            className="loading loading-spinner loading-lg text-primary"
            aria-label="Loading the book"
          />
        </div>
      );
    }
    return <BookDetails book={book} />;
  };

  return (
    <>
      <Link to={getReturnPath(location.state)} className="link mb-6 inline-block">
        Back to results
      </Link>
      {renderContent()}
    </>
  );
}
