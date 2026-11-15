import { useState } from 'react';

import { getCoverUrl, PLACEHOLDER_COVER_URL } from '../lib/books';
import type { ImageLinks } from '../services/googleBooks.types';

interface BookCoverProps {
  imageLinks: ImageLinks | undefined;
  title: string;
  size?: 'thumbnail' | 'large';
  /** Next to the book's title the image adds nothing for screen readers. */
  decorative?: boolean;
  className?: string;
}

/** A cover that falls back to the placeholder when the book has no image or it fails to load. */
export function BookCover({
  imageLinks,
  title,
  size = 'thumbnail',
  decorative = false,
  className = '',
}: BookCoverProps) {
  const preferredUrl = getCoverUrl(imageLinks, size);
  const [brokenUrl, setBrokenUrl] = useState<string>();
  const src = preferredUrl === brokenUrl ? PLACEHOLDER_COVER_URL : preferredUrl;

  return (
    <img
      src={src}
      alt={decorative ? '' : `Cover of ${title}`}
      width={400}
      height={600}
      loading={size === 'thumbnail' ? 'lazy' : 'eager'}
      className={`block aspect-[2/3] h-auto bg-base-300 object-cover ${className}`.trim()}
      onError={() => {
        setBrokenUrl(preferredUrl);
      }}
    />
  );
}
