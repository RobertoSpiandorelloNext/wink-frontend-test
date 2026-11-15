/** Grey placeholders in the shape of the results, shown during the first load of a search. */
export function ResultsSkeleton({ count }: { count: number }) {
  return (
    <>
      <p role="status" className="visually-hidden">
        Loading results
      </p>
      <ul className="list-unstyled d-grid gap-3 mb-4" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="card">
            <div className="card-body d-flex gap-3 placeholder-glow">
              <span className="placeholder book-cover book-cover--thumb rounded" />
              <div className="flex-grow-1">
                <span className="placeholder col-7 d-block mb-2" />
                <span className="placeholder col-4 d-block mb-3" />
                <span className="placeholder col-12 d-block mb-1" />
                <span className="placeholder col-9 d-block" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
