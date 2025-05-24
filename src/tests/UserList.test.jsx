import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserList from '../components/UserList';

// Simulamos la respuesta de fetch
const mockUsers = [
  { id: 1, name: 'Mariana', email: 'mariana@example.com' },
  { id: 2, name: 'Carlos', email: 'carlos@example.com' }
];

describe('UserList Component', () => {
  beforeEach(() => {
    // Mock global fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUsers),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('muestra los usuarios correctamente', async () => {
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    // Esperamos a que aparezca "Mariana" luego del fetch async
    await waitFor(() => {
      expect(screen.getByText('Mariana')).toBeInTheDocument();
      expect(screen.getByText('Carlos')).toBeInTheDocument();
    });
  });
});
