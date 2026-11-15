/** Placeholders in the shape of the results, shown during the first load of a search. */
export function ResultsSkeleton({ count }: { count: number }) {
  return (
    <>
      <output className="sr-only">Loading results</output>
      <ul className="mb-6 grid gap-3" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="card bg-base-100 shadow-sm">
            <div className="card-body flex-row gap-4 p-4 sm:p-5">
              <div className="skeleton aspect-[2/3] w-18 shrink-0 sm:w-22" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="skeleton h-5 w-3/5" />
                <div className="skeleton mb-2 h-4 w-1/3" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-4/5" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
