import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dev log title', () => {
  render(<App />);
  const title = screen.getByText(/SafeLogiX Dev Log/i);
  expect(title).toBeInTheDocument();
});