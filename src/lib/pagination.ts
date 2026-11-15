export type PageItem = number | 'gap';

export function getPageCount(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * The page numbers a paginator shows: always the first and the last page, plus `siblings` pages
 * on each side of the current one. A gap that would hide a single page shows that page instead.
 *
 * getPageWindow(6, 20) -> [1, 'gap', 5, 6, 7, 'gap', 20]
 */
export function getPageWindow(current: number, pageCount: number, siblings = 1): PageItem[] {
  const pages = new Set([1, pageCount]);
  for (let page = current - siblings; page <= current + siblings; page += 1) {
    if (page >= 1 && page <= pageCount) {
      pages.add(page);
    }
  }

  const items: PageItem[] = [];
  let previous = 0;
  for (const page of [...pages].sort((a, b) => a - b)) {
    if (page - previous === 2) {
      items.push(previous + 1);
    } else if (page - previous > 2) {
      items.push('gap');
    }
    items.push(page);
    previous = page;
  }
  return items;
}
