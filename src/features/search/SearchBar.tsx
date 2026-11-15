import { useId } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** Enter searches right away instead of waiting for the typing pause. */
  onSubmit: () => void;
  isBusy: boolean;
}

export function SearchBar({ value, onChange, onSubmit, isBusy }: SearchBarProps) {
  const inputId = useId();

  return (
    <form
      role="search"
      className="w-full md:flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Search books
      </label>
      <div className="input input-lg w-full">
        <svg
          className="size-5 opacity-60"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
        <input
          id={inputId}
          type="search"
          className="grow"
          placeholder="Search by title, author or ISBN"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
        />
        {isBusy && (
          <output
            className="loading loading-spinner loading-sm text-primary"
            aria-label="Loading"
          />
        )}
      </div>
    </form>
  );
}
