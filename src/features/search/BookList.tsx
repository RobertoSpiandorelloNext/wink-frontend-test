import type { Volume } from '../../services/googleBooks.types';
import { BookListItem } from './BookListItem';

export function BookList({ books }: { books: readonly Volume[] }) {
  return (
    <ul className="list-unstyled d-grid gap-3 mb-4">
      {books.map((book) => (
        <BookListItem key={book.id} book={book} />
      ))}
    </ul>
  );
}
