import { describe, expect, it } from 'vitest';

import {
  formatAuthors,
  getCoverUrl,
  getPublicationYear,
  PLACEHOLDER_COVER_URL,
  toPlainText,
} from './books';

describe('getCoverUrl', () => {
  const imageLinks = {
    smallThumbnail: 'http://books.google.com/small',
    thumbnail: 'http://books.google.com/thumb',
    large: 'http://books.google.com/large',
  };

  it('uses the placeholder required by the brief when there is no image', () => {
    expect(PLACEHOLDER_COVER_URL).toBe('https://placehold.co/400x600/FF5039/FFF?text=Book+Cover');
    expect(getCoverUrl(undefined)).toBe(PLACEHOLDER_COVER_URL);
    expect(getCoverUrl({})).toBe(PLACEHOLDER_COVER_URL);
    expect(getCoverUrl({ thumbnail: '' })).toBe(PLACEHOLDER_COVER_URL);
  });

  it('prefers the thumbnail for lists and the largest image for the book page', () => {
    expect(getCoverUrl(imageLinks)).toBe('https://books.google.com/thumb');
    expect(getCoverUrl(imageLinks, 'large')).toBe('https://books.google.com/large');
  });

  it('prefers the 128px thumbnail to the 80px one when no large image exists', () => {
    expect(
      getCoverUrl(
        {
          smallThumbnail: 'https://books.google.com/small',
          thumbnail: 'https://books.google.com/thumb',
        },
        'large',
      ),
    ).toBe('https://books.google.com/thumb');
  });

  it('falls back to whatever size exists', () => {
    expect(getCoverUrl({ smallThumbnail: 'https://books.google.com/small' }, 'large')).toBe(
      'https://books.google.com/small',
    );
  });

  it('upgrades http links to https and leaves https links alone', () => {
    expect(getCoverUrl({ thumbnail: 'HTTP://example.com/a' })).toBe('https://example.com/a');
    expect(getCoverUrl({ thumbnail: 'https://example.com/a' })).toBe('https://example.com/a');
  });
});

describe('formatAuthors', () => {
  it('joins the authors, or says that they are unknown', () => {
    expect(formatAuthors(['Frank Herbert'])).toBe('Frank Herbert');
    expect(formatAuthors(['Terry Pratchett', 'Neil Gaiman'])).toBe('Terry Pratchett, Neil Gaiman');
    expect(formatAuthors([])).toBe('Unknown author');
    expect(formatAuthors(undefined)).toBe('Unknown author');
  });
});

describe('getPublicationYear', () => {
  it.each([
    ['1965-08-01', '1965'],
    ['1965-08', '1965'],
    ['1965', '1965'],
    ['', undefined],
    [undefined, undefined],
  ])('reads the year of %s', (date, year) => {
    expect(getPublicationYear(date)).toBe(year);
  });
});

describe('toPlainText', () => {
  it('drops the markup and decodes entities', () => {
    expect(toPlainText('<p>Arrakis &amp; <b>spice</b></p>\n<p>Second   paragraph</p>')).toBe(
      'Arrakis & spice Second paragraph',
    );
  });

  it('never runs scripts', () => {
    expect(toPlainText('<img src=x onerror="window.hacked = true">Safe')).toBe('Safe');
    expect(window).not.toHaveProperty('hacked');
  });
});
