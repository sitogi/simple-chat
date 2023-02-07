import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import App from '~/App';

test('render App component', () => {
  render(<App />);
  expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
});
