import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { makeStore } from '../app/store';
import { routes } from '../routes';

/** Renders the whole application at `path`, with a fresh store and an in-memory router. */
export function renderApp(path = '/') {
  const store = makeStore();
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const user = userEvent.setup();
  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
  return { user, router, store };
}
