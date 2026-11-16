import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('categoria');
  const currentSearch = searchParams.get('buscar') || '';

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/productos?buscar=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/productos');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <circle cx="20" cy="20" r="19" fill="#D31334" />
          {/* Pétalo central de loto / movimiento */}
          <path
            d="M20 8.5C16.8 13.2 15.5 17.5 15.5 21.2C15.5 24.4 17.5 26.8 20 26.8C22.5 26.8 24.5 24.4 24.5 21.2C24.5 17.5 23.2 13.2 20 8.5Z"
            fill="#FFFFFF"
          />
          {/* Pétalo / onda izquierda */}
          <path
            d="M14.2 25.5C11.2 24.1 9.2 21.1 9.5 16.5C12.6 17.5 14.5 20.1 15.2 23.6"
            stroke="#FFFFFF"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pétalo / onda derecha */}
          <path
            d="M25.8 25.5C28.8 24.1 30.8 21.1 30.5 16.5C27.4 17.5 25.5 20.1 24.8 23.6"
            stroke="#FFFFFF"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Línea de flujo inferior */}
          <path
            d="M12.5 29.8C15.2 31.4 17.6 32 20 32C22.4 32 24.8 31.4 27.5 29.8"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        <span>MIDORI&apos;S FLOW</span>
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
        {showSearch ? (
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (location.pathname === '/productos') {
                  const params = new URLSearchParams(location.search);
                  if (val.trim()) {
                    params.set('buscar', val);
                  } else {
                    params.delete('buscar');
                  }
                  navigate(`/productos?${params.toString()}`, { replace: true });
                }
              }}
              style={{
                padding: '0.375rem 0.625rem',
                fontSize: '0.875rem',
                border: '0.0625rem solid var(--lulu-black)',
                borderRadius: '0.25rem',
                outline: 'none',
                width: '12.5rem',
                fontFamily: 'inherit'
              }}
            />
            <button type="submit" className="icon-btn" title="Buscar">
              <span>🔍</span>
            </button>
            <button
              type="button"
              className="icon-btn"
              title="Cerrar búsqueda"
              onClick={() => {
                setShowSearch(false);
                if (searchQuery) {
                  setSearchQuery('');
                  if (location.pathname === '/productos') {
                    const params = new URLSearchParams(location.search);
                    params.delete('buscar');
                    navigate(`/productos?${params.toString()}`, { replace: true });
                  }
                }
              }}
              style={{ color: '#888', fontSize: '0.9rem' }}
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="icon-btn"
            onClick={() => setShowSearch(true)}
          >
            <span>🔍</span> Buscar
          </button>
        )}
        
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
