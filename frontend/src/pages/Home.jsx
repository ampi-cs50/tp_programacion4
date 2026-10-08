import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="hero-banner">
        <img src="/hero.jpg" alt="Running outdoors" />
        <div className="hero-content">
          <h1>Siente el movimiento</h1>
          <p>La nueva colección de running ya está aquí. Diseñada para llevarte más lejos.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link to="/productos" className="btn btn-primary">Comprar Mujer</Link>
            <Link to="/productos" className="btn btn-black">Comprar Hombre</Link>
          </div>
        </div>
      </div>
      
      <div className="container" style={{ marginBottom: '60px' }}>
        <h2 className="section-title">Favoritos de la temporada</h2>
        <div className="product-grid">
          {/* Placeholder items for the home page */}
          <div className="product-card">
            <div className="product-img-wrapper" style={{ background: '#e0e0e0' }}>
               {/* Later we can map real products here */}
            </div>
            <div className="product-info">
              <span className="product-brand">Lulutienda</span>
              <h3 className="product-name">Leggings Align™ Cintura Alta</h3>
              <span className="product-price">$98.00</span>
            </div>
          </div>
          <div className="product-card">
            <div className="product-img-wrapper" style={{ background: '#d5d5d5' }}></div>
            <div className="product-info">
              <span className="product-brand">Lulutienda</span>
              <h3 className="product-name">Define Jacket Luon</h3>
              <span className="product-price">$118.00</span>
            </div>
          </div>
          <div className="product-card">
            <div className="product-img-wrapper" style={{ background: '#ececec' }}></div>
            <div className="product-info">
              <span className="product-brand">Lulutienda</span>
              <h3 className="product-name">Pace Rival Mid-Rise Skirt</h3>
              <span className="product-price">$78.00</span>
            </div>
          </div>
          <div className="product-card">
            <div className="product-img-wrapper" style={{ background: '#cfcfcf' }}></div>
            <div className="product-info">
              <span className="product-brand">Lulutienda</span>
              <h3 className="product-name">Scuba Oversized Half-Zip</h3>
              <span className="product-price">$118.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
