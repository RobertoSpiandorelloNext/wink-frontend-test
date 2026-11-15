import { act, screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { PLACEHOLDER_COVER_URL } from '../../lib/books';
import { makeVolume } from '../../test/fixtures';
import { renderApp } from '../../test/renderApp';
import { API, catalogs, searchRequests, server } from '../../test/server';

const searchBox = () => screen.getByRole('searchbox', { name: 'Search books' });
const summary = () => screen.findByText(/^Showing/);
const lastRequest = () => searchRequests.at(-1)?.searchParams;

describe('Search page', () => {
  it('invites the user to search and sends no request until something is typed', () => {
    renderApp();

    expect(screen.getByText(/Start typing to search/)).toBeInTheDocument();
    expect(searchRequests).toHaveLength(0);
  });

  describe('live search', () => {
    it('shows the results of what is typed, with the default page size', async () => {
      const { user } = renderApp();

      await user.type(searchBox(), 'dune');

      expect(await screen.findByRole('link', { name: 'dune volume 1' })).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /^dune volume/ })).toHaveLength(10);
      expect(lastRequest()?.get('q')).toBe('dune');
      expect(lastRequest()?.get('startIndex')).toBe('0');
      expect(lastRequest()?.get('maxResults')).toBe('10');
    });

    it('waits for a pause in the typing, so a word costs one request rather than one per key', async () => {
      const { user } = renderApp();

      await user.type(searchBox(), 'dune');
      await screen.findByRole('link', { name: 'dune volume 1' });

      expect(searchRequests.map((url) => url.searchParams.get('q'))).toEqual(['dune']);
    });

    it('updates the results for each new character', async () => {
      const { user } = renderApp();

      await user.type(searchBox(), 'dun');
      expect(await screen.findByRole('link', { name: 'dun volume 1' })).toBeInTheDocument();

      await user.type(searchBox(), 'e');
      expect(await screen.findByRole('link', { name: 'dune volume 1' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'dun volume 1' })).not.toBeInTheDocument();
    });

    it('searches immediately on Enter', async () => {
      const { user } = renderApp();

      await user.type(searchBox(), 'dune{Enter}');

      expect(await screen.findByRole('link', { name: 'dune volume 1' })).toBeInTheDocument();
    });

    it('ignores spaces around the text', async () => {
      const { user } = renderApp();

      await user.type(searchBox(), '  dune  ');
      await screen.findByRole('link', { name: 'dune volume 1' });

      expect(lastRequest()?.get('q')).toBe('dune');
    });

    it('goes back to the intro when the box is cleared', async () => {
      const { user } = renderApp('/?q=dune');
      await screen.findByRole('link', { name: 'dune volume 1' });

      await user.clear(searchBox());

      expect(await screen.findByText(/Start typing to search/)).toBeInTheDocument();
    });
  });

  describe('list view', () => {
    it('shows each book with its cover, authors, year and a description clamped to two lines', async () => {
      renderApp('/?q=dune');

      const firstBook = (await screen.findAllByRole('listitem'))[0];
      if (!firstBook) throw new Error('No results');
      expect(within(firstBook).getByText('Author of dune-1')).toBeInTheDocument();
      expect(within(firstBook).getByText('(2001)')).toBeInTheDocument();
      expect(within(firstBook).getByText('Description of dune-1.')).toHaveClass('text-clamp-2');
      expect(firstBook.querySelector('img')).toHaveAttribute(
        'src',
        'https://books.google.com/books/content?id=dune-1&zoom=1',
      );
    });

    it('uses the placeholder cover when a book has no image', async () => {
      catalogs.nocover = [makeVolume('nocover-1', { imageLinks: undefined })];
      renderApp('/?q=nocover');

      const book = await screen.findByRole('listitem');
      expect(book.querySelector('img')).toHaveAttribute('src', PLACEHOLDER_COVER_URL);
    });

    it('says so when nothing matches', async () => {
      renderApp('/?q=nothing-matches-this');

      expect(await screen.findByText(/No books found for/)).toHaveTextContent(
        'No books found for nothing-matches-this.',
      );
    });
  });

  describe('pagination', () => {
    it('derives the number of pages from the total and moves between them', async () => {
      const { user, router } = renderApp('/?q=dune');

      expect(await summary()).toHaveTextContent('Showing 1 to 10 of about 47 results');
      expect(screen.getByRole('link', { name: 'Page 5' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Page 6' })).not.toBeInTheDocument();

      await user.click(screen.getByRole('link', { name: 'Next page' }));

      expect(await screen.findByRole('link', { name: 'dune volume 11' })).toBeInTheDocument();
      expect(await summary()).toHaveTextContent('Showing 11 to 20 of about 47 results');
      expect(lastRequest()?.get('startIndex')).toBe('10');
      expect(router.state.location.search).toBe('?q=dune&page=2');
    });

    it('lets the user choose 5, 10, 15 or 20 results per page, starting again from page 1', async () => {
      const { user } = renderApp('/?q=dune&page=2');
      await screen.findByRole('link', { name: 'dune volume 11' });

      const select = screen.getByRole('combobox', { name: 'Results per page' });
      expect(
        within(select)
          .getAllByRole('option')
          .map((option) => option.textContent),
      ).toEqual(['5', '10', '15', '20']);

      await user.selectOptions(select, '20');

      expect(await summary()).toHaveTextContent('Showing 1 to 20 of about 47 results');
      expect(lastRequest()?.get('maxResults')).toBe('20');
      expect(lastRequest()?.get('startIndex')).toBe('0');
      expect(screen.getByRole('link', { name: 'Page 3' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Page 4' })).not.toBeInTheDocument();
    });

    it('restores a search, page and page size from the URL', async () => {
      renderApp('/?q=dune&page=3&size=5');

      expect(await summary()).toHaveTextContent('Showing 11 to 15 of about 47 results');
      expect(searchBox()).toHaveValue('dune');
      expect(lastRequest()?.get('startIndex')).toBe('10');
      expect(lastRequest()?.get('maxResults')).toBe('5');
    });

    it('handles a page that turns out to be empty', async () => {
      renderApp('/?q=dun&page=5');

      expect(await screen.findByText(/no more results on this page/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go to the first page' })).toHaveAttribute(
        'href',
        '/?q=dun',
      );
    });
  });

  describe('network', () => {
    it('loads the next page as soon as the user points at its link', async () => {
      const { user } = renderApp('/?q=dune');
      await screen.findByRole('link', { name: 'dune volume 1' });

      await user.hover(screen.getByRole('link', { name: 'Next page' }));

      await waitFor(() => {
        expect(lastRequest()?.get('startIndex')).toBe('10');
      });
    });

    it('serves pages it has already loaded from the cache', async () => {
      const { user } = renderApp('/?q=dune');
      await screen.findByRole('link', { name: 'dune volume 1' });
      await user.click(screen.getByRole('link', { name: 'Next page' }));
      await screen.findByRole('link', { name: 'dune volume 11' });
      const requestsSoFar = searchRequests.length;

      await user.click(screen.getByRole('link', { name: 'Previous page' }));

      expect(await screen.findByRole('link', { name: 'dune volume 1' })).toBeInTheDocument();
      expect(searchRequests).toHaveLength(requestsSoFar);
    });

    it('explains a rate limit and lets the user try again', async () => {
      server.use(
        http.get(
          API,
          () =>
            HttpResponse.json({ error: { code: 429, message: 'Quota exceeded' } }, { status: 429 }),
          { once: true },
        ),
      );
      const { user } = renderApp('/?q=dune');

      expect(await screen.findByRole('alert')).toHaveTextContent(/too many requests/);

      await user.click(screen.getByRole('button', { name: 'Try again' }));

      expect(await screen.findByRole('link', { name: 'dune volume 1' })).toBeInTheDocument();
    });

    it('does not retry a rate-limited request on its own', async () => {
      let calls = 0;
      server.use(
        http.get(API, () => {
          calls += 1;
          return HttpResponse.json(
            { error: { code: 429, message: 'Quota exceeded' } },
            { status: 429 },
          );
        }),
      );
      renderApp('/?q=dune');

      // The error is only shown once retries are over, so by now any retry would have happened.
      await screen.findByRole('alert');

      expect(calls).toBe(1);
    });

    it('retries a server error before giving up', async () => {
      let calls = 0;
      server.use(
        http.get(API, () => {
          calls += 1;
          return HttpResponse.json(
            { error: { code: 503, message: 'Backend Error' } },
            { status: 503 },
          );
        }),
      );
      renderApp('/?q=dune');

      expect(await screen.findByRole('alert', {}, { timeout: 5000 })).toHaveTextContent(
        /having problems/,
      );
      expect(calls).toBe(3);
    });
  });

  it('shows the search from the URL when the user navigates back to it', async () => {
    const { user, router } = renderApp('/?q=dun');
    await screen.findByRole('link', { name: 'dun volume 1' });
    await user.type(searchBox(), 'e');
    await screen.findByRole('link', { name: 'dune volume 1' });

    await act(() => router.navigate('/?q=dun'));

    expect(searchBox()).toHaveValue('dun');
    expect(await screen.findByRole('link', { name: 'dun volume 1' })).toBeInTheDocument();
  });
});
