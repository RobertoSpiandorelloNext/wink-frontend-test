import { useEffect, useEffectEvent, useState } from 'react';

import { useDebouncedValue } from '../../hooks/useDebouncedValue';

/**
 * Keeps the search box and the URL in step.
 *
 * The box updates on every keystroke; the URL (and therefore the request) follows once typing
 * pauses for `delayMs`. When the URL changes for another reason, such as the browser's back
 * button, the box shows the URL's text instead.
 */
export function useSearchInput(
  query: string,
  setQuery: (query: string) => void,
  delayMs: number,
): [string, (value: string) => void] {
  const [input, setInput] = useState(query);
  const debouncedInput = useDebouncedValue(input, delayMs);

  // Adjusting state while rendering (instead of in an effect) avoids showing a stale value.
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    if (query !== debouncedInput.trim()) {
      // The URL changed through navigation, not because of what was typed.
      setInput(query);
    }
  }

  // Surrounding spaces do not change the search, so they do not start a new one either.
  const commit = useEffectEvent((value: string) => {
    if (value.trim() !== query) {
      setQuery(value.trim());
    }
  });

  useEffect(() => {
    commit(debouncedInput);
  }, [debouncedInput]);

  return [input, setInput];
}
