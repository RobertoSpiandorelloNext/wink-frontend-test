import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="py-16 text-center">
      <title>Page not found - Book Search</title>
      <h1 className="mb-2 text-2xl font-semibold">Page not found</h1>
      <p className="mb-6 text-base-content/70">The address you followed does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Search books
      </Link>
    </section>
  );
}
