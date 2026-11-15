import { describe, expect, it } from 'vitest';

import { getPageCount, getPageWindow } from './pagination';

describe('getPageCount', () => {
  it.each([
    [0, 10, 0],
    [1, 10, 1],
    [10, 10, 1],
    [11, 10, 2],
    [47, 5, 10],
    [47, 20, 3],
  ])('%i items in pages of %i make %i pages', (total, size, pages) => {
    expect(getPageCount(total, size)).toBe(pages);
  });
});

describe('getPageWindow', () => {
  it('lists every page when there are only a few', () => {
    expect(getPageWindow(1, 1)).toEqual([1]);
    expect(getPageWindow(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('keeps the first and last page and the neighbours of the current one', () => {
    expect(getPageWindow(6, 20)).toEqual([1, 'gap', 5, 6, 7, 'gap', 20]);
  });

  it('shows a page instead of a gap that would hide only that page', () => {
    expect(getPageWindow(4, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    expect(getPageWindow(17, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
  });

  it('handles the edges', () => {
    expect(getPageWindow(1, 20)).toEqual([1, 2, 'gap', 20]);
    expect(getPageWindow(20, 20)).toEqual([1, 'gap', 19, 20]);
  });

  it('can show more neighbours', () => {
    expect(getPageWindow(10, 20, 2)).toEqual([1, 'gap', 8, 9, 10, 11, 12, 'gap', 20]);
  });
});
