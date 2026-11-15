import { Link, Outlet, ScrollRestoration } from 'react-router';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <header className="border-b border-base-300 bg-base-100">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center px-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
            <img src="/favicon.svg" alt="" width={28} height={28} />
            <span>Book Search</span>
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-base-300 py-4 text-center text-sm text-base-content/70">
        Book data from the{' '}
        <a
          href="https://developers.google.com/books"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          Google Books API
        </a>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
