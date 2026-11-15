import { BookCover } from '../../components/BookCover';
import { formatAuthors, toHttps } from '../../lib/books';
import type { Volume } from '../../services/googleBooks.types';
import { BookDescription } from './BookDescription';

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

function getLanguageName(code: string): string {
  try {
    return languageNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export function BookDetails({ book }: { book: Volume }) {
  const info = book.volumeInfo;
  const title = info.title ?? 'Untitled';
  const isbns = (info.industryIdentifiers ?? [])
    .filter(({ type }) => type.startsWith('ISBN'))
    .map(({ identifier }) => identifier);

  const facts: [string, string | undefined][] = [
    ['Publisher', info.publisher],
    ['Published', info.publishedDate],
    ['Pages', info.pageCount ? String(info.pageCount) : undefined],
    ['Language', info.language ? getLanguageName(info.language) : undefined],
    ['Categories', info.categories?.join(', ')],
    ['ISBN', isbns.length > 0 ? isbns.join(', ') : undefined],
    [
      'Rating',
      info.averageRating === undefined
        ? undefined
        : `${info.averageRating} / 5 (${info.ratingsCount ?? 0} ratings)`,
    ],
  ];

  return (
    <article className="row g-4">
      <title>{`${title} - Book Search`}</title>
      <div className="col-12 col-md-4 col-lg-3">
        <BookCover
          imageLinks={info.imageLinks}
          title={title}
          size="large"
          className="book-cover--large rounded shadow-sm"
        />
      </div>

      <div className="col-12 col-md-8 col-lg-9">
        <h1 className="h2 mb-1">{title}</h1>
        {info.subtitle && <p className="lead text-body-secondary mb-2">{info.subtitle}</p>}
        <p className="mb-3">by {formatAuthors(info.authors)}</p>

        {info.infoLink && (
          <a
            href={toHttps(info.infoLink)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mb-4"
          >
            View on Google Books
          </a>
        )}

        <dl className="row book-facts mb-4">
          {facts
            .filter((fact): fact is [string, string] => Boolean(fact[1]))
            .map(([label, value]) => (
              <div key={label} className="col-12 col-sm-6 col-xl-4">
                <dt className="small text-body-secondary fw-normal">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>

        <h2 className="h5">Description</h2>
        {info.description ? (
          <BookDescription html={info.description} />
        ) : (
          <p className="text-body-secondary">No description available.</p>
        )}
      </div>
    </article>
  );
}
