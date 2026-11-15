import { describe, expect, it } from 'vitest';

import { getReturnPath } from './returnPath';

describe('getReturnPath', () => {
  it('returns to the search the book was opened from', () => {
    expect(getReturnPath({ from: '?q=dune&page=2' })).toBe('/?q=dune&page=2');
  });

  it.each([undefined, null, 'text', {}, { from: 42 }, { from: 'https://example.com' }])(
    'goes home when the state is %j',
    (state) => {
      expect(getReturnPath(state)).toBe('/');
    },
  );
});
