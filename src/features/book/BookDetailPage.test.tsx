import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PLACEHOLDER_COVER_URL } from '../../lib/books';
import { makeVolume } from '../../test/fixtures';
import { renderApp } from '../../test/renderApp';
import { books } from '../../test/server';

describe('Book page', () => {
  it('opens from the list and shows the book with its link on Google Books', async () => {
    const { user } = renderApp('/?q=dune');

    await user.click(await screen.findByRole('link', { name: 'dune volume 1' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Dune' })).toBeInTheDocument();
    expect(screen.getByText('by Author of dune-1')).toBeInTheDocument();
    expect(screen.getByText('Chilton Books')).toBeInTheDocument();
    expect(screen.getByText('412')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Cover of Dune' })).toHaveAttribute(
      'src',
      'https://books.google.com/books/content?id=dune-1&zoom=1',
    );
    const infoLink = screen.getByRole('link', { name: 'View on Google Books' });
    expect(infoLink).toHaveAttribute('href', 'https://books.google.com/books?id=dune-1');
    expect(infoLink).toHaveAttribute('target', '_blank');
    expect(infoLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('returns to the same search and page', async () => {
    const { user, router } = renderApp('/?q=dune&page=2');

    await user.click(await screen.findByRole('link', { name: 'dune volume 11' }));
    await user.click(await screen.findByRole('link', { name: 'Back to results' }));

    expect(router.state.location.search).toBe('?q=dune&page=2');
    expect(await screen.findByRole('link', { name: 'dune volume 11' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search books' })).toHaveValue('dune');
  });

  it('works when opened directly from its URL', async () => {
    renderApp('/books/dune-1');

    expect(await screen.findByRole('heading', { level: 1, name: 'Dune' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to results' })).toHaveAttribute('href', '/');
  });

  it('uses the 400x600 placeholder when the book has no cover', async () => {
    books.set('nocover', makeVolume('nocover', { title: 'No Cover', imageLinks: undefined }));
    renderApp('/books/nocover');

    expect(await screen.findByRole('img', { name: 'Cover of No Cover' })).toHaveAttribute(
      'src',
      PLACEHOLDER_COVER_URL,
    );
  });

  it('keeps the formatting of the description but removes anything unsafe', async () => {
    books.set(
      'html',
      makeVolume('html', {
        title: 'Formatted',
        description:
          '<p>A <b>bold</b> story.</p><img src="x" onerror="alert(1)"><script>alert(2)</script>',
      }),
    );
    renderApp('/books/html');

    const bold = await screen.findByText('bold');
    expect(bold.tagName).toBe('B');
    const description = bold.closest('.book-description');
    expect(description?.querySelector('img, script')).toBeNull();
    expect(description?.innerHTML).not.toContain('onerror');
  });

  it('says so when the book does not exist', async () => {
    renderApp('/books/unknown-id');

    expect(await screen.findByText('This book could not be found.')).toBeInTheDocument();
  });
});
