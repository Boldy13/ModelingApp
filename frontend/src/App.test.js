jest.mock('@react-three/fiber', () => ({
  Canvas: () => <div data-testid="canvas" />,
}));

jest.mock('@react-three/drei', () => ({
  Grid: () => null,
  OrbitControls: () => null,
}));

import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 'default',
          name: 'Starter Scene',
          objects: [],
        }),
    })
  );
});

test('renders the scene editor shell', async () => {
  render(<App />);

  expect(screen.getByText(/scene editor/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add cube/i })).toBeInTheDocument();
  expect(await screen.findByText(/loaded starter scene/i)).toBeInTheDocument();
});
