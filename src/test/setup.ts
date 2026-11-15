import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { searchRequests, server } from './server';

// jsdom does not implement scrolling, which the router's scroll restoration uses.
Object.defineProperty(window, 'scrollTo', { value: () => undefined, writable: true });

beforeAll(() => {
  // A request without a matching handler fails the test instead of reaching the real API.
  server.listen({ onUnhandledFrame: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  searchRequests.length = 0;
});

afterAll(() => {
  server.close();
});
