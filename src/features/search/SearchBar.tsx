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
      className="flex-grow-1"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor={inputId} className="visually-hidden">
        Search books
      </label>
      <div className="input-group input-group-lg">
        <span className="input-group-text bg-body" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </span>
        <input
          id={inputId}
          type="search"
          className="form-control"
          placeholder="Search by title, author or ISBN"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          autoFocus
        />
        {isBusy && (
          <span className="input-group-text bg-body">
            <span className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading</span>
            </span>
          </span>
        )}
      </div>
    </form>
  );
}
