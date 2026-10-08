import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('api_token') || null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('user_email') || null);

  const login = (apiToken, email) => {
    localStorage.setItem('api_token', apiToken);
    localStorage.setItem('user_email', email);
    setToken(apiToken);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('api_token');
    localStorage.removeItem('user_email');
    setToken(null);
    setUserEmail(null);
  };

  // Configurar el interceptor de Axios para que siempre mande el token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, userEmail, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
