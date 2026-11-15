import { Link, useLocation } from 'react-router';

import { BookCover } from '../../components/BookCover';
import { formatAuthors, getPublicationYear, toPlainText } from '../../lib/books';
import type { Volume } from '../../services/googleBooks.types';

export function BookListItem({ book }: { book: Volume }) {
  const location = useLocation();
  const { title = 'Untitled', subtitle, authors, publishedDate, description } = book.volumeInfo;
  const year = getPublicationYear(publishedDate);

  return (
    <li className="card book-row">
      <div className="card-body d-flex gap-3">
        <BookCover
          imageLinks={book.volumeInfo.imageLinks}
          title={title}
          decorative
          className="book-cover--thumb rounded"
        />
        <div className="min-w-0">
          <h2 className="h5 mb-1">
            {/* The whole card is clickable; the search is kept so "Back" returns to it. */}
            <Link
              to={`/books/${encodeURIComponent(book.id)}`}
              state={{ from: location.search }}
              className="stretched-link text-decoration-none"
            >
              {title}
            </Link>
          </h2>
          {subtitle && <p className="text-body-secondary small mb-1">{subtitle}</p>}
          <p className="small mb-2">
            {formatAuthors(authors)}
            {year && <span className="text-body-secondary"> ({year})</span>}
          </p>
          <p className="text-clamp-2 text-body-secondary mb-0">
            {description ? toPlainText(description) : 'No description available.'}
          </p>
        </div>
      </div>
    </li>
  );
}
