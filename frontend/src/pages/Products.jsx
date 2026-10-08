import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// La URL base dependerá de dónde corra tu backend de Rails (usualmente localhost:3000)
const API_URL = 'http://localhost:3000/api/v1';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reemplaza esto con tu endpoint real de Rails
    axios.get(`${API_URL}/products`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setError("Hubo un problema al cargar los productos. Por favor intenta de nuevo.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="section-title">Todos los Productos</h1>
      
      {loading && <div className="loader"></div>}
      
      {error && (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <p className="error-message">{error}</p>
          <button className="btn btn-outline" onClick={() => window.location.reload()} style={{ marginTop: '15px' }}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: 'center', margin: '60px 0' }}>
          <p>No se encontraron productos.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map(product => (
            <Link to={`/productos/${product.id}`} key={product.id} className="product-card">
              <div className="product-img-wrapper">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{color: '#999', fontSize: '0.8rem'}}>Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="product-info">
                <span className="product-brand">{product.category?.name || "Lulutienda"}</span>
                <h3 className="product-name">{product.name}</h3>
                <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
