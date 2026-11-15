interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div
      className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center gap-2"
      role="alert"
    >
      <span className="flex-grow-1">{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
