import { describe, expect, it } from 'vitest';

import { DEFAULT_PAGE_SIZE, parseSearchParams, toSearchParams } from './searchParams';

const parse = (search: string) => parseSearchParams(new URLSearchParams(search));

describe('parseSearchParams', () => {
  it('reads the query, page and page size', () => {
    expect(parse('q=dune&page=3&size=20')).toEqual({ query: 'dune', page: 3, pageSize: 20 });
  });

  it('uses the defaults when the values are missing', () => {
    expect(parse('')).toEqual({ query: '', page: 1, pageSize: DEFAULT_PAGE_SIZE });
  });

  it('trims the query', () => {
    expect(parse('q=%20%20dune%20').query).toBe('dune');
  });

  it.each(['page=0', 'page=-2', 'page=1.5', 'page=abc'])(
    'falls back to the first page for %s',
    (search) => {
      expect(parse(search).page).toBe(1);
    },
  );

  it.each(['size=7', 'size=40', 'size=abc'])(
    'only accepts the allowed page sizes, so %s gives the default',
    (search) => {
      expect(parse(search).pageSize).toBe(DEFAULT_PAGE_SIZE);
    },
  );
});

describe('toSearchParams', () => {
  it('leaves the defaults out of the URL', () => {
    expect(toSearchParams({ query: '', page: 1, pageSize: 10 }).toString()).toBe('');
  });

  it('round-trips with parseSearchParams', () => {
    const state = { query: 'the left hand', page: 4, pageSize: 5 } as const;
    expect(parseSearchParams(toSearchParams(state))).toEqual(state);
  });
});
