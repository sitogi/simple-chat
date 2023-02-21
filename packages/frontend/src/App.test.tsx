import { screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { App } from '~/App';
import { renderWithProviders } from '~/common/testUtils';

test('render App component', () => {
  renderWithProviders(<App />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
