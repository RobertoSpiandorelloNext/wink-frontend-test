import { Link } from 'react-router';

import { getPageWindow } from '../lib/pagination';

interface PaginatorProps {
  page: number;
  pageCount: number;
  hrefForPage: (page: number) => string;
  /** Called on hover or focus of a page link, so that page can be loaded before the click. */
  onPageIntent?: (page: number) => void;
}

/**
 * Bootstrap pagination made of real links, so pages can be opened in a new tab and the browser's
 * back button walks through them. On small screens only the current page number is shown.
 */
export function Paginator({ page, pageCount, hrefForPage, onPageIntent }: PaginatorProps) {
  if (pageCount <= 1) {
    return null;
  }

  const linkTo = (target: number, label: string, ariaLabel?: string) => (
    <Link
      className="page-link"
      to={hrefForPage(target)}
      aria-label={ariaLabel}
      onMouseEnter={() => onPageIntent?.(target)}
      onFocus={() => onPageIntent?.(target)}
    >
      {label}
    </Link>
  );

  return (
    <nav aria-label="Search result pages">
      <ul className="pagination justify-content-center flex-wrap mb-0">
        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
          {page <= 1 ? (
            <span className="page-link">Previous</span>
          ) : (
            linkTo(page - 1, 'Previous', 'Previous page')
          )}
        </li>

        {getPageWindow(page, pageCount).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className="page-item disabled d-none d-sm-block">
              <span className="page-link">...</span>
            </li>
          ) : item === page ? (
            <li key={item} className="page-item active" aria-current="page">
              <span className="page-link">{item}</span>
            </li>
          ) : (
            <li key={item} className="page-item d-none d-sm-block">
              {linkTo(item, String(item), `Page ${item}`)}
            </li>
          ),
        )}
        {/* The other page numbers are hidden on small screens; this keeps the total visible. */}
        <li className="page-item disabled d-sm-none">
          <span className="page-link">of {pageCount}</span>
        </li>

        <li className={`page-item ${page >= pageCount ? 'disabled' : ''}`}>
          {page >= pageCount ? (
            <span className="page-link">Next</span>
          ) : (
            linkTo(page + 1, 'Next', 'Next page')
          )}
        </li>
      </ul>
    </nav>
  );
}
