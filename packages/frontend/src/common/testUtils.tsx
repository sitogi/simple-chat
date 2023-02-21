import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render } from '@testing-library/react';

export function renderWithProviders(sut: ReactNode): ReturnType<typeof render> {
  window.history.pushState({}, 'Test page', '/');

  return {
    ...render(<BrowserRouter>{sut}</BrowserRouter>),
  };
}
