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
    <article className="grid gap-8 md:grid-cols-[16rem_1fr] lg:grid-cols-[18rem_1fr]">
      <title>{`${title} - Book Search`}</title>
      <BookCover
        imageLinks={info.imageLinks}
        title={title}
        size="large"
        className="mx-auto w-full max-w-72 rounded-box shadow-md"
      />

      <div className="min-w-0">
        <h1 className="text-3xl font-bold">{title}</h1>
        {info.subtitle && <p className="mt-1 text-xl text-base-content/70">{info.subtitle}</p>}
        <p className="mt-2">by {formatAuthors(info.authors)}</p>

        {info.infoLink && (
          <a
            href={toHttps(info.infoLink)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-4"
          >
            View on Google Books
          </a>
        )}

        <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
          {facts
            .filter((fact): fact is [string, string] => Boolean(fact[1]))
            .map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-base-content/70">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>

        <h2 className="mt-8 mb-2 text-lg font-semibold">Description</h2>
        {info.description ? (
          <BookDescription html={info.description} />
        ) : (
          <p className="text-base-content/70">No description available.</p>
        )}
      </div>
    </article>
  );
}
