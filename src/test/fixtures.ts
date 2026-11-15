import type { Volume, VolumeInfo } from '../services/googleBooks.types';

export function makeVolume(id: string, info: Partial<VolumeInfo> = {}): Volume {
  return {
    id,
    volumeInfo: {
      title: `Title of ${id}`,
      authors: [`Author of ${id}`],
      publishedDate: '2001-05-01',
      description: `Description of ${id}.`,
      imageLinks: {
        smallThumbnail: `http://books.google.com/books/content?id=${id}&zoom=5`,
        thumbnail: `http://books.google.com/books/content?id=${id}&zoom=1`,
      },
      infoLink: `http://books.google.com/books?id=${id}`,
      ...info,
    },
  };
}

/** A search result set of `total` books, ids "<prefix>-1" to "<prefix>-<total>". */
export function makeCatalog(prefix: string, total: number): Volume[] {
  return Array.from({ length: total }, (_, index) =>
    makeVolume(`${prefix}-${index + 1}`, { title: `${prefix} volume ${index + 1}` }),
  );
}
