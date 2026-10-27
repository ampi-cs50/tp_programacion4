import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';

// Mocks
vi.mock('axios');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login-btn">Google Login</div>,
}));

describe('Login Component - User Interaction & API Integration Tests', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <AuthContext.Provider value={{ login: mockLogin, isAuthenticated: false }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders login form with inputs and submit button', () => {
    renderComponent();

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
  });

  it('successful login interaction (Caso esperado): fills form, calls API, logs in and redirects', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        api_token: 'mock-api-token-xyz',
        user: { id: 1, email_address: 'atleta@midorisflow.com' }
      }
    });

    renderComponent();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitBtn = screen.getByRole('button', { name: /continuar/i });

    fireEvent.change(emailInput, { target: { value: 'atleta@midorisflow.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/login',
        {
          email_address: 'atleta@midorisflow.com',
          password: 'Secret123!'
        }
      );
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('mock-api-token-xyz', 'atleta@midorisflow.com');
      expect(mockNavigate).toHaveBeenCalledWith('/productos');
    });
  });

  it('failed login interaction (Caso de error): shows 401 error message when credentials are invalid', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { error: 'Correo o contraseña incorrectos.' }
      }
    });

    renderComponent();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitBtn = screen.getByRole('button', { name: /continuar/i });

    fireEvent.change(emailInput, { target: { value: 'usuario@erroneo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passwordInvalida' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('client validation error: rejects malformed email address without making API call', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitBtn = screen.getByRole('button', { name: /continuar/i });

    fireEvent.change(emailInput, { target: { value: 'correo-invalido-sin-arroba' } });
    fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });
    const form = submitBtn.closest('form');
    fireEvent.submit(form);

    expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });
});
