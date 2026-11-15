import DOMPurify from 'dompurify';
import { useMemo } from 'react';

// The book page receives the description as HTML. Only basic formatting is kept: anything else
// (scripts, styles, links, event handlers) is removed before the markup reaches the page.
const ALLOWED_TAGS = ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li'];

export function BookDescription({ html }: { html: string }) {
  const safeHtml = useMemo(
    () => DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR: [] }),
    [html],
  );

  return (
    <div
      className="book-description max-w-3xl leading-relaxed"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
