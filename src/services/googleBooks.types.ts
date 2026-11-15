// The parts of the Google Books "volume" resource that this app requests.
// Reference: https://developers.google.com/books/docs/v1/reference/volumes

export interface ImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
}

export interface IndustryIdentifier {
  type: string;
  identifier: string;
}

/** Every field is optional: the API omits whatever it does not know about a book. */
export interface VolumeInfo {
  title?: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
  imageLinks?: ImageLinks;
  infoLink?: string;
  industryIdentifiers?: IndustryIdentifier[];
  averageRating?: number;
  ratingsCount?: number;
}

export interface Volume {
  id: string;
  volumeInfo: VolumeInfo;
}

/** A page of search results. `items` is missing when the page is empty. */
export interface VolumeList {
  totalItems: number;
  items?: Volume[];
}
