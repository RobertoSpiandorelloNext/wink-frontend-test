import { setupListeners } from '@reduxjs/toolkit/query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { makeStore } from './app/store';
import { routes } from './routes';
import './styles/main.css';

const store = makeStore();
// Lets RTK Query refetch the visible data when the connection comes back.
setupListeners(store.dispatch);

const router = createBrowserRouter(routes);

const container = document.getElementById('root');
if (!container) {
  throw new Error('The #root element is missing from index.html');
}

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
