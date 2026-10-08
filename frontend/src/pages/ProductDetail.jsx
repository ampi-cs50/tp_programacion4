import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setError("No se pudo cargar el producto.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="container" style={{textAlign: 'center', marginTop: '40px'}}><p className="error-message">{error}</p><Link to="/productos" className="btn btn-outline" style={{marginTop: '20px'}}>Volver a productos</Link></div>;
  if (!product) return null;

  return (
    <div className="container" style={{ display: 'flex', gap: '40px', marginTop: '60px', marginBottom: '60px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
        ) : (
          <div style={{ width: '100%', aspectRatio: '4/5', background: '#eaeaea', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#888' }}>Sin imagen</span>
          </div>
        )}
      </div>
      
      <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ fontSize: '0.85rem', color: 'var(--lulu-dark-gray)', marginBottom: '15px' }}>
          <Link to="/productos" style={{ textDecoration: 'underline' }}>Productos</Link> / {product.category?.name || "Categoría"}
        </nav>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '15px' }}>{product.name}</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '30px' }}>${parseFloat(product.price).toFixed(2)}</p>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ color: 'var(--lulu-dark-gray)' }}>{product.description || "Un producto diseñado para el máximo rendimiento y comodidad. Ideal para tu día a día o tus entrenamientos más intensos."}</p>
        </div>

        <button className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', marginBottom: '15px' }}>
          Agregar al carrito
        </button>
        <button className="btn btn-outline" style={{ padding: '16px', fontSize: '1.1rem' }}>
          Favoritos
        </button>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--lulu-border)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--lulu-dark-gray)' }}>
            <strong>Disponibilidad:</strong> {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
