import { describe, expect, it } from 'vitest';

import { describeError, isNotFound } from './errors';

describe('describeError', () => {
  it('explains a rate limit', () => {
    expect(describeError({ status: 429, data: {} })).toMatch(/too many requests/);
  });

  it('explains a network failure', () => {
    expect(describeError({ status: 'FETCH_ERROR', error: 'TypeError: Failed to fetch' })).toMatch(
      /could not be reached/,
    );
  });

  it('explains a server error', () => {
    expect(describeError({ status: 503, data: {} })).toMatch(/having problems/);
  });

  it('has a generic message for anything else', () => {
    expect(describeError({ status: 400, data: {} })).toMatch(/Something went wrong/);
    expect(describeError({ message: 'boom' })).toMatch(/Something went wrong/);
  });
});

describe('isNotFound', () => {
  it('recognizes a 404 only', () => {
    expect(isNotFound({ status: 404, data: {} })).toBe(true);
    expect(isNotFound({ status: 500, data: {} })).toBe(false);
    expect(isNotFound(undefined)).toBe(false);
  });
});
