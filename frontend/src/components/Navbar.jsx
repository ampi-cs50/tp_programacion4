import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <svg width="35" height="35" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"/>
          <path d="M 30 70 Q 50 20 70 70" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
        </svg>
        LULUTIENDA
      </Link>
      
      <div className="nav-links">
        <Link to="/productos">Mujer</Link>
        <Link to="/productos">Hombre</Link>
        <Link to="/productos">Accesorios</Link>
      </div>

      <div className="nav-actions">
        <button className="icon-btn">
          <span>🔍</span> Buscar
        </button>
        
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: '0.85rem', color: 'var(--lulu-dark-gray)' }}>Hola, {userEmail.split('@')[0]}</span>
            <button onClick={handleLogout} className="icon-btn" style={{ color: 'var(--lulu-red)' }}>
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" className="icon-btn">
            <span>👤</span> Iniciar Sesión
          </Link>
        )}
        
        <button className="icon-btn">
          <span>🛒</span> Carrito
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
