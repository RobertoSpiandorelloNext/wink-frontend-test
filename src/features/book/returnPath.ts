/**
 * Where "Back to results" leads. Links from the list pass the search they came from (for example
 * "?q=dune&page=2") in the navigation state; a book opened directly has none and goes home.
 */
export function getReturnPath(state: unknown): string {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string' &&
    state.from.startsWith('?')
  ) {
    return `/${state.from}`;
  }
  return '/';
}
