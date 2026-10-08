import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const API_URL = 'http://localhost:3000/api/v1';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTraditionalAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    // VALIDACIONES FRONTEND
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo válido (ejemplo: nombre@dominio.com).');
      return;
    }

    if (!isLogin && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    const endpoint = isLogin ? '/login' : '/signup';

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, {
        email_address: email,
        password: password
      });

      if (response.data.api_token) {
        login(response.data.api_token, email);
        navigate('/productos');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Correo o contraseña incorrectos.');
      } else if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Mensajes de validación de Rails
      } else {
        setError('Hubo un problema al conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        credential: credentialResponse.credential
      });

      if (response.data.api_token) {
        const decodedToken = jwtDecode(credentialResponse.credential);
        login(response.data.api_token, decodedToken.email);
        navigate('/productos');
      }
    } catch (err) {
      setError('No se pudo iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '80px auto' }}>
      <h1 className="section-title" style={{ fontSize: '1.8rem', marginTop: 0, textTransform: 'none' }}>
        Inicia sesión o crea una cuenta
      </h1>
      
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #ef4444', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleTraditionalAuth}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            className="form-control" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            className="form-control" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-black" 
          style={{ width: '100%', marginTop: '10px' }}
          disabled={loading}
        >
          {loading ? 'Procesando...' : (isLogin ? 'Continuar' : 'Crear Cuenta')}
        </button>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--lulu-dark-gray)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? "¿No tienes cuenta? Crea una aquí." : "¿Ya tienes cuenta? Inicia sesión."}
          </button>
        </div>
      </form>

      <div style={{ textAlign: 'center', margin: '30px 0', color: 'var(--lulu-dark-gray)', fontSize: '0.9rem' }}>
        o
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('La ventana de Google falló.')}
          useOneTap
        />
      </div>
    </div>
  );
}

export default Login;
