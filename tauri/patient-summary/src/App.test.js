import { render, screen } from '@testing-library/react';
import App from './App';

test('renders veterinary patient summary system', () => {
  render(<App />);
  const linkElement = screen.getByText(/Veterinary Patient Summary System/i);
  expect(linkElement).toBeInTheDocument();
});

