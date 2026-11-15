import type { ImageLinks } from '../services/googleBooks.types';

/** Used when a book has no cover: 400x600, background FF5039, white "Book Cover" text. */
export const PLACEHOLDER_COVER_URL = 'https://placehold.co/400x600/FF5039/FFF?text=Book+Cover';

// The order in which the sizes are tried. Google's "thumbnail" (128px wide) is the right size for
// list rows; "smallThumbnail" (80px) is only a fallback.
const FOR_LIST: readonly (keyof ImageLinks)[] = [
  'thumbnail',
  'smallThumbnail',
  'small',
  'medium',
  'large',
  'extraLarge',
];
const FOR_PAGE: readonly (keyof ImageLinks)[] = [
  'large',
  'medium',
  'small',
  'thumbnail',
  'smallThumbnail',
  'extraLarge',
];

/** Google returns plain http:// links; on an https page they would be mixed content. */
export function toHttps(url: string): string {
  return url.replace(/^http:\/\//i, 'https://');
}

/** Picks the best cover for the space available, or the placeholder when the book has none. */
export function getCoverUrl(
  imageLinks: ImageLinks | undefined,
  size: 'thumbnail' | 'large' = 'thumbnail',
): string {
  const order = size === 'large' ? FOR_PAGE : FOR_LIST;
  const url = order.map((key) => imageLinks?.[key]).find(Boolean);
  return url ? toHttps(url) : PLACEHOLDER_COVER_URL;
}

export function formatAuthors(authors: readonly string[] | undefined): string {
  return authors && authors.length > 0 ? authors.join(', ') : 'Unknown author';
}

/** "2004-06-01", "2004-06" and "2004" all give "2004". */
export function getPublicationYear(publishedDate: string | undefined): string | undefined {
  return /^\d{4}/.exec(publishedDate ?? '')?.[0];
}

/**
 * Descriptions may contain HTML. In the list they are shown as plain text; parsing with
 * DOMParser decodes entities and never runs scripts.
 */
export function toPlainText(html: string): string {
  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent;
  return text.replace(/\s+/g, ' ').trim();
}
