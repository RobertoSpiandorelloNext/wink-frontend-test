import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { Paginator } from './Paginator';

const hrefForPage = (page: number) => `?q=dune&page=${page}`;

function renderPaginator(page: number, pageCount: number, onPageIntent?: (page: number) => void) {
  return render(
    <MemoryRouter>
      <Paginator
        page={page}
        pageCount={pageCount}
        hrefForPage={hrefForPage}
        onPageIntent={onPageIntent}
      />
    </MemoryRouter>,
  );
}

describe('Paginator', () => {
  it('renders nothing when everything fits on one page', () => {
    const { container } = renderPaginator(1, 1);
    expect(container).toBeEmptyDOMElement();
  });

  it('links to the previous, next and nearby pages', () => {
    renderPaginator(6, 20);

    expect(screen.getByRole('link', { name: 'Previous page' })).toHaveAttribute(
      'href',
      '/?q=dune&page=5',
    );
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute(
      'href',
      '/?q=dune&page=7',
    );
    expect(screen.getByRole('link', { name: 'Page 20' })).toHaveAttribute(
      'href',
      '/?q=dune&page=20',
    );
    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('marks the current page and does not link to it', () => {
    renderPaginator(3, 5);

    const current = screen.getByText('3').closest('li');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Page 3' })).not.toBeInTheDocument();
  });

  it('keeps the total visible for small screens, where the other numbers are hidden', () => {
    renderPaginator(3, 49);

    expect(screen.getByText('of 49').closest('li')).toHaveClass('d-sm-none');
    expect(screen.getByRole('link', { name: 'Page 4' }).closest('li')).toHaveClass('d-none');
  });

  it('disables "Previous" on the first page and "Next" on the last', () => {
    const { unmount } = renderPaginator(1, 5);
    expect(screen.queryByRole('link', { name: 'Previous page' })).not.toBeInTheDocument();
    expect(screen.getByText('Previous').closest('li')).toHaveClass('disabled');
    unmount();

    renderPaginator(5, 5);
    expect(screen.queryByRole('link', { name: 'Next page' })).not.toBeInTheDocument();
    expect(screen.getByText('Next').closest('li')).toHaveClass('disabled');
  });

  it('reports the page a user is about to open', async () => {
    const onPageIntent = vi.fn();
    renderPaginator(1, 5, onPageIntent);

    await userEvent.hover(screen.getByRole('link', { name: 'Next page' }));

    expect(onPageIntent).toHaveBeenCalledWith(2);
  });
});
