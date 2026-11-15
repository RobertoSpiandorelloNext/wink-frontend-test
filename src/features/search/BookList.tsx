import type { Volume } from '../../services/googleBooks.types';
import { BookListItem } from './BookListItem';

export function BookList({ books }: { books: readonly Volume[] }) {
  return (
    <ul className="mb-6 grid gap-3">
      {books.map((book) => (
        <BookListItem key={book.id} book={book} />
      ))}
    </ul>
  );
}
