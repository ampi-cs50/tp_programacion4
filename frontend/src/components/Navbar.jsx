import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('categoria');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" opacity="0.2"/>
          <path d="M 32 64 C 42 32, 58 32, 68 64 C 55 76, 45 76, 32 64 Z" fill="currentColor" fillOpacity="0.2"/>
          <path d="M 38 52 C 46 38, 54 38, 62 52"/>
        </svg>
        MIDORI'S FLOW
      </Link>
      
      <div className="nav-links">
        <Link 
          to="/productos?categoria=Mujer" 
          className={location.pathname === '/productos' && currentCategory === 'Mujer' ? 'active-link' : ''}
        >
          Mujer
        </Link>
        <Link 
          to="/productos?categoria=Hombre" 
          className={location.pathname === '/productos' && currentCategory === 'Hombre' ? 'active-link' : ''}
        >
          Hombre
        </Link>
        <Link 
          to="/productos?categoria=Accesorios" 
          className={location.pathname === '/productos' && currentCategory === 'Accesorios' ? 'active-link' : ''}
        >
          Accesorios
        </Link>
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
        
        <Link to="/carrito" className="icon-btn" style={{ position: 'relative' }}>
          <span>🛒</span> Carrito
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-0.3125rem',
              right: '-0.625rem',
              background: 'var(--lulu-red)',
              color: 'white',
              borderRadius: '50%',
              width: '1.125rem',
              height: '1.125rem',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
