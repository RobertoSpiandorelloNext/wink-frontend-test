# Book Search

A responsive single-page application, written for the WiNK web application test, that searches the [Google Books API](https://developers.google.com/books/docs/v1/reference/volumes/list), paginates the results and shows the details of each book.

**Stack:** React 19, TypeScript, Redux Toolkit (RTK Query), React Router, Tailwind CSS 4 with DaisyUI 5, Vite. Tests with Vitest, Testing Library and Mock Service Worker.

**Live application:** [wwrrm2-5173.csb.app](https://wwrrm2-5173.csb.app/), running on CodeSandbox ([sandbox with the code](https://codesandbox.io/p/devbox/magical-matsumoto-wwrrm2)). After a while without visits the sandbox goes to sleep, so the first load can take a few seconds.

A PDF walkthrough of what the application does and why it is built this way is available in [English](docs/technical-documentation-en.pdf) and [Italian](docs/documentazione-tecnica-it.pdf).

## Requirements

| Requirement                                                  | Where and how                                                                                              |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| SPA in React, responsive                                     | React 19 with React Router; Tailwind's responsive utilities, checked on phone and desktop widths           |
| Search the `volumes?q=` endpoint and show the results        | `src/services/googleBooksApi.ts` (RTK Query), `src/features/search`                                        |
| Pagination through API parameters, dynamic number of pages   | `startIndex` and `maxResults` are sent to the API; the number of pages comes from `totalItems`             |
| Page size of 5, 10, 15 or 20                                 | "Results per page" select; changing it goes back to page 1                                                 |
| A paginator to change pages                                  | `src/components/Paginator.tsx`, a DaisyUI button group with previous/next and a window of page numbers     |
| Detail page with the book's information and its `infoLink`   | `src/features/book`, route `/books/:bookId`; "View on Google Books" opens the `infoLink`                   |
| Placeholder when there is no image                           | `https://placehold.co/400x600/FF5039/FFF?text=Book+Cover`, also used when an image fails to load           |
| Description truncated to 2 lines with "..."                  | Tailwind's `line-clamp-2` utility (CSS line clamp)                                                         |
| Live search, updated for every new character                 | The results follow what is typed; requests wait for a 300 ms pause in the typing (see [Network](#network)) |
| Fully responsive layout with a UI framework                  | Tailwind CSS 4.3 with DaisyUI 5.8, the alternative to Bootstrap suggested by the brief (see below)         |
| Nice to have: TailwindCSS/DaisyUI, Redux Toolkit, TypeScript | All three. DaisyUI's theme uses `#FF5039`, the colour of the placeholder in the brief, as primary colour   |

The brief asks for the latest Bootstrap and, among the nice-to-have items, suggests TailwindCSS/DaisyUI instead of it, so the interface is built with Tailwind CSS and DaisyUI. The other styling nice-to-have, customising the theme colours with Sass, belongs to the Bootstrap route: Tailwind CSS 4 is not meant to be combined with Sass, so the theme colours are customised through DaisyUI's theme variables instead.

## Getting started

Requirements: Node.js 22.12 or later.

```bash
npm install
npm run dev        # http://localhost:5173
```

### Google Books API key (recommended)

Without a key, Google serves every caller from one shared anonymous quota, which is often used up: the API then answers `429 Too Many Requests` and the app shows a message saying so. With a key, requests count against the key's own project quota instead.

1. In the [Google Cloud console](https://console.cloud.google.com/apis/credentials), create an API key and enable the Books API for the project.
2. Restrict the key to the Books API and to your HTTP referrers (for example `localhost:5173` and `*.csb.app`): the key ends up in the browser bundle, which is normal for a browser key.
3. Copy `.env.example` to `.env.local` and set `VITE_GOOGLE_BOOKS_API_KEY`, or set the same variable in the environment of the sandbox.

### CodeSandbox

The application runs in a CodeSandbox VM Sandbox created from the GitHub repository: open `https://githubbox.com/<owner>/<repo>`, or choose "Import template" in the dashboard's import dialog and paste the repository URL. `.devcontainer/devcontainer.json` selects Node.js 22, `.codesandbox/tasks.json` installs the dependencies and starts the dev server on port 5173, and `vite.config.ts` allows the `*.csb.app` preview host.

The sandbox created this way follows the repository and cannot be edited. To use an API key, fork it into your workspace, add `VITE_GOOGLE_BOOKS_API_KEY` under Menu > Env variables and restart the VM.

## How it works

### Search state in the URL

The search text, the page and the page size are kept in the query string (`/?q=dune&page=3&size=20`). The URL is the single source of truth: a search survives a reload, can be shared, and the browser's back button moves through the pages. The book page receives the search it was opened from, so "Back to results" returns to the same page of the same search, and a book opened from a link or reloaded still works because it is loaded by id.

Redux holds the RTK Query cache only. Copying the URL state into a Redux slice would mean keeping two copies of the same thing in sync.

### Network

All requests go through one RTK Query API (`src/services/googleBooksApi.ts`):

- **Live search with a short debounce.** The search box updates on every keystroke and the URL, and with it the request, follows once typing pauses for 300 ms. Typing "dune" costs one request instead of four, which matters with a daily quota, and the results never show a search older than what is in the box. Enter searches immediately.
- **Caching.** Responses stay cached for five minutes. Going back to a page or a search already seen shows it immediately, without a request.
- **No flicker.** While the next page or search loads, the current results stay on screen, dimmed, instead of being replaced by a spinner.
- **Prefetching.** Pointing at a page link (hover or keyboard focus) loads that page in the background, so it is usually ready when clicked.
- **Retries where they make sense.** Network failures and 5xx responses are retried twice with exponential backoff. Client errors are not: a bad request will not improve, and retrying a 429 would only use more quota.
- **Smaller responses.** The `fields` parameter asks Google for the fields the screens use only.
- **Errors people can act on.** Rate limits, network failures and server errors each have their own message, with a "Try again" button.
- **Reconnection.** When the browser comes back online, the visible data is fetched again.

### Pagination

A page is requested with `startIndex = (page - 1) * pageSize` and `maxResults = pageSize`, and the number of pages is `ceil(totalItems / pageSize)`.

Two quirks of the real API shape this. `totalItems` is an estimate that changes from one page to the next (a search for "dune" reported 512 results on its first page and 1,217 on its third), and Google only serves roughly the first thousand results: past that, pages come back empty, with `totalItems: 0`, or are refused with a 400. The paginator therefore offers at most the first 1,000 results, and a later page that comes back empty or refused shows a short message with a link to the first page instead of an error or a misleading "no books found". Out-of-range values in the URL (page 0, a page size of 7) fall back to the defaults.

On small screens the paginator shows only previous, the current page, the total and next, so it always fits on one line.

### Books and safety

Covers use the largest image available on the book page and the 128 px thumbnail in the list. Google returns `http://` image links, which are upgraded to `https://` to avoid mixed content. The detail endpoint returns the description as HTML: it is sanitised with DOMPurify, keeping only basic formatting such as paragraphs, bold and lists. In the list it is shown as plain text.

### Accessibility

The search box and the page-size select have labels, the current page is marked with `aria-current`, result counts and loading states are announced through status regions, covers next to a title are treated as decorative, and every book row is a single link that also works from the keyboard. Animations respect `prefers-reduced-motion`.

## Project structure

```text
src/
  main.tsx                  entry point: store, router, styles
  routes.tsx                the routes, shared by the app and the tests
  app/store.ts              Redux store (RTK Query cache)
  services/
    googleBooksApi.ts       the API: endpoints, retries, caching, partial responses
    googleBooks.types.ts    the parts of the Google Books resources the app uses
  features/
    search/                 search page, search box, page-size select, result list, URL state
    book/                   book page, sanitised description, "Back to results" target
  components/               layout, paginator, book cover, error alert, not-found page
  hooks/useDebouncedValue.ts
  lib/                      pure helpers: pagination window, covers and text, error messages
  styles/main.css           Tailwind and DaisyUI setup, the theme and the few custom styles
  test/                     test setup, mock API (MSW) and fixtures
docs/                       technical documentation (PDF, English and Italian)
```

Components stay small and presentational where possible; the logic that can be tested without a browser (pagination window, URL parsing, cover selection, error messages) lives in plain functions.

## Testing

```bash
npm test               # all tests, once
npm run test:coverage  # with a coverage report
npm run check          # type check, lint, format check and tests, as in CI
```

The tests render the real application with an in-memory router and a fresh store, and Mock Service Worker plays the Google Books API, so no test touches the network. They cover the requirements one by one (live search, page size, paginator, detail page, placeholder, two-line description) and the network behaviour: one request per pause in typing, cached pages, prefetching, the rate-limit message and retry, retries on server errors, empty pages, sanitised descriptions and back navigation. Assertions use what the user sees (roles, labels, text), not implementation details.

GitHub Actions runs the type check, lint, format check, tests and build on every push.

## Scripts

| Script                  | What it does                                     |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Dev server with hot reload                       |
| `npm run build`         | Type check and production build into `dist/`     |
| `npm run preview`       | Serves the production build                      |
| `npm test`              | Runs the tests once                              |
| `npm run test:watch`    | Runs the tests in watch mode                     |
| `npm run test:coverage` | Tests with a coverage report                     |
| `npm run lint`          | ESLint (TypeScript strict rules and React hooks) |
| `npm run format`        | Formats the code with Prettier                   |
| `npm run check`         | Everything CI runs, except the build             |
