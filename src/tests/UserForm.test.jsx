import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from '../components/UserForm';
import { MemoryRouter, Route, Routes } from 'react-router-dom';


// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

beforeEach(() => {
  fetch.resetMocks();         // limpia mocks anteriores
  mockedNavigate.mockClear(); // limpia navegación anterior
});

test('crea un usuario', async () => {
  // Simula la respuesta exitosa del backend
  fetch.mockResponseOnce(JSON.stringify({ message: 'Usuario creado' }), { status: 200 });

  render(
    <MemoryRouter initialEntries={['/users/create']}>
      <Routes>
        <Route path="/users/create" element={<UserForm />} />
      </Routes>
    </MemoryRouter>
  );

  // Completa los campos
  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
  fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'juan@correo.com' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } });

  // Envía el formulario
fireEvent.click(screen.getByRole('button', { name: /crear usuario/i }));
  // Espera a que se haga el navigate
  await waitFor(() => {
    expect(mockedNavigate).toHaveBeenCalledWith('/users');
  });

  // Asegúrate que se haya hecho la petición
  expect(fetch).toHaveBeenCalledWith(
    'http://localhost:8000/api/users',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
      }),
    })
  );
});
