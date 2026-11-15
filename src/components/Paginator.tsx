import { Fragment } from 'react';
import { Link } from 'react-router';

import { getPageWindow, type PageItem } from '../lib/pagination';

interface PaginatorProps {
  page: number;
  pageCount: number;
  hrefForPage: (page: number) => string;
  /** Called on hover or focus of a page link, so that page can be loaded before the click. */
  onPageIntent?: (page: number) => void;
}

/**
 * Pagination made of real links, so pages can be opened in a new tab and the browser's back
 * button walks through them. On small screens only the current page and the total are shown.
 */
export function Paginator({ page, pageCount, hrefForPage, onPageIntent }: PaginatorProps) {
  if (pageCount <= 1) {
    return null;
  }

  const linkTo = (target: number, label: string, ariaLabel: string, className = '') => (
    <Link
      className={`join-item btn ${className}`.trim()}
      to={hrefForPage(target)}
      aria-label={ariaLabel}
      onMouseEnter={() => onPageIntent?.(target)}
      onFocus={() => onPageIntent?.(target)}
    >
      {label}
    </Link>
  );

  const disabled = (label: string) => (
    <span className="join-item btn btn-disabled" aria-disabled="true">
      {label}
    </span>
  );

  const renderItem = (item: PageItem) => {
    if (item === 'gap') {
      return (
        <span className="join-item btn btn-disabled hidden sm:inline-flex" aria-hidden="true">
          ...
        </span>
      );
    }
    if (item === page) {
      return (
        <span className="join-item btn btn-primary" aria-current="page">
          {item}
        </span>
      );
    }
    return linkTo(item, String(item), `Page ${item}`, 'hidden sm:inline-flex');
  };

  return (
    <nav aria-label="Search result pages" className="flex justify-center">
      <div className="join">
        {page <= 1 ? disabled('Previous') : linkTo(page - 1, 'Previous', 'Previous page')}
        {getPageWindow(page, pageCount).map((item, index) => (
          // A gap can appear twice, so positions (not values) identify the items.
          <Fragment key={item === 'gap' ? `gap-${index}` : item}>{renderItem(item)}</Fragment>
        ))}
        {/* The other page numbers are hidden on small screens; this keeps the total visible. */}
        <span className="join-item btn btn-disabled sm:hidden">of {pageCount}</span>
        {page >= pageCount ? disabled('Next') : linkTo(page + 1, 'Next', 'Next page')}
      </div>
    </nav>
  );
}
