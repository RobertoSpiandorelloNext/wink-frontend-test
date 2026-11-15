/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional Google Books API key (see .env.example). */
  readonly VITE_GOOGLE_BOOKS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
