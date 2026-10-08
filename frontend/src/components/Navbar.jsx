import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        {/* We can use a simple SVG or text for the logo */}
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
        <Link to="/login" className="icon-btn">
          <span>👤</span> Iniciar Sesión
        </Link>
        <button className="icon-btn">
          <span>🛒</span> Carrito
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
