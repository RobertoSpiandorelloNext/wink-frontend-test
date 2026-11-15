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
      return (
        <p className="py-5 text-center" role="status">
          This book could not be found.
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
    if (!book) {
      return (
        <div className="d-flex justify-content-center py-5">
          <span className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading the book</span>
          </span>
        </div>
      );
    }
    return <BookDetails book={book} />;
  };

  return (
    <>
      <Link to={getReturnPath(location.state)} className="d-inline-block mb-4">
        Back to results
      </Link>
      {renderContent()}
    </>
  );
}
