import { Link, useLocation } from 'react-router';

import { BookCover } from '../../components/BookCover';
import { formatAuthors, getPublicationYear, toPlainText } from '../../lib/books';
import type { Volume } from '../../services/googleBooks.types';

export function BookListItem({ book }: { book: Volume }) {
  const location = useLocation();
  const { title = 'Untitled', subtitle, authors, publishedDate, description } = book.volumeInfo;
  const year = getPublicationYear(publishedDate);

  return (
    <li className="card relative bg-base-100 shadow-sm transition hover:-translate-y-px hover:shadow-md focus-within:ring-2 focus-within:ring-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="card-body flex-row gap-4 p-4 sm:p-5">
        <BookCover
          imageLinks={book.volumeInfo.imageLinks}
          title={title}
          decorative
          className="w-18 shrink-0 rounded sm:w-22"
        />
        <div className="min-w-0">
          <h2 className="mb-1 text-lg font-semibold">
            {/* The link covers the whole card; the search is kept so "Back" returns to it. */}
            <Link
              to={`/books/${encodeURIComponent(book.id)}`}
              state={{ from: location.search }}
              className="text-primary-ink outline-none after:absolute after:inset-0 hover:underline"
            >
              {title}
            </Link>
          </h2>
          {subtitle && <p className="mb-1 text-sm text-base-content/70">{subtitle}</p>}
          <p className="mb-2 text-sm">
            {formatAuthors(authors)}
            {year && <span className="text-base-content/70"> ({year})</span>}
          </p>
          <p className="line-clamp-2 text-base-content/70">
            {description ? toPlainText(description) : 'No description available.'}
          </p>
        </div>
      </div>
    </li>
  );
}
