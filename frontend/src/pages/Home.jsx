import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then(res => {
        // Tomamos los primeros 4 productos para destacar
        setFeaturedProducts(res.data.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading featured products:", err);
        setLoading(false);
      });
  }, []);

  const formatPrice = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return '$' + num.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div>
      {/* HERO BANNER */}
      <div className="hero-banner">
        <img 
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&auto=format&fit=crop&q=80" 
          alt="Yoga y Running Activewear" 
        />
        <div className="hero-content">
          <h1>Siente el movimiento</h1>
          <p>Indumentaria técnica para yoga, pilates, running y caminata diaria. Diseñada para acompañar cada uno de tus movimientos.</p>
          <div style={{ display: 'flex', gap: '0.9375rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/productos?categoria=Mujer" className="btn btn-primary">Comprar Mujer</Link>
            <Link to="/productos?categoria=Hombre" className="btn btn-black">Comprar Hombre</Link>
          </div>
        </div>
      </div>
      
      {/* SECCIÓN CATEGORÍAS PRINCIPALES (MIDORI'S FLOW) */}
      <div className="container" style={{ marginTop: '3.125rem' }}>
        <h2 className="section-title">Comprar por Colección</h2>
        <div className="category-home-grid">
          {/* Tarjeta Mujer */}
          <Link to="/productos?categoria=Mujer" className="category-home-card" style={{ background: '#f5f5f5' }}>
            <img 
              src="/products/align_leggings.jpg" 
              alt="Colección Mujer - Yoga & Pilates" 
              style={{ objectFit: 'contain', padding: '1.25rem' }}
            />
            <div className="category-home-overlay">
              <h3>Mujer</h3>
              <p>Leggings Align™, corpiños Energy, camperas Define y biker shorts.</p>
              <span>Explorar Mujer &rarr;</span>
            </div>
          </Link>

          {/* Tarjeta Hombre */}
          <Link to="/productos?categoria=Hombre" className="category-home-card" style={{ background: '#f5f5f5' }}>
            <img 
              src="/products/abc_jogger.jpg" 
              alt="Colección Hombre - Running & Training" 
              style={{ objectFit: 'contain', padding: '1.25rem' }}
            />
            <div className="category-home-overlay">
              <h3>Hombre</h3>
              <p>Joggers técnicos ABC™, remeras Metal Vent y shorts Pace Breaker.</p>
              <span>Explorar Hombre &rarr;</span>
            </div>
          </Link>

          {/* Tarjeta Accesorios */}
          <Link to="/productos?categoria=Accesorios" className="category-home-card" style={{ background: '#f5f5f5' }}>
            <img 
              src="/products/yoga_mat.jpg" 
              alt="Accesorios - Mats, Riñoneras & Botellas" 
              style={{ objectFit: 'contain', padding: '1.25rem' }}
            />
            <div className="category-home-overlay">
              <h3>Accesorios</h3>
              <p>The Mat 5mm reversible, riñoneras Everywhere y botellas térmicas.</p>
              <span>Explorar Accesorios &rarr;</span>
            </div>
          </Link>
        </div>
      </div>

      {/* PRODUCTOS DESTACADOS DE LA TIENDA */}
      <div className="container" style={{ marginBottom: '3.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.625rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Favoritos de la temporada</h2>
            <p style={{ color: 'var(--lulu-dark-gray)', fontSize: '0.95rem' }}>Lo más elegido por nuestra comunidad</p>
          </div>
          <Link to="/productos" style={{ fontWeight: '600', color: 'var(--lulu-red)', fontSize: '0.95rem' }}>
            Ver todo el catálogo &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="product-grid" style={{ padding: '0 0 1.25rem' }}>
            {featuredProducts.map(product => (
              <Link to={`/productos/${product.id}`} key={product.id} className="product-card">
                <div className="product-img-wrapper">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#999', fontSize: '0.8rem' }}>Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <span className="product-brand">{product.category?.name || "Colección"}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-price">{formatPrice(product.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
