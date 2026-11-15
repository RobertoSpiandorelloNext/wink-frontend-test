import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="text-center py-5">
      <title>Page not found - Book Search</title>
      <h1 className="h3">Page not found</h1>
      <p className="text-body-secondary">The address you followed does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Search books
      </Link>
    </section>
  );
}
