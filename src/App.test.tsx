import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

describe('App', () => {
  it('renders without crashing', async () => {
    const el = document.createElement('div');
    const root = createRoot(el);

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
});
