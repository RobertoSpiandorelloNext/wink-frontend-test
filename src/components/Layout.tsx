import { Link, Outlet, ScrollRestoration } from 'react-router';

export function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="app-header">
        <nav className="navbar container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-semibold">
            <img src="/favicon.svg" alt="" width={28} height={28} />
            Book Search
          </Link>
        </nav>
      </header>

      <main className="container flex-grow-1 py-4">
        <Outlet />
      </main>

      <footer className="border-top py-3 text-center text-body-secondary small">
        Book data from the{' '}
        <a href="https://developers.google.com/books" target="_blank" rel="noopener noreferrer">
          Google Books API
        </a>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
