import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const API_URL = 'http://localhost:3000/api/v1';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/products/${id}`)
      .then(response => {
        const prod = response.data;
        setProduct(prod);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedColor(prod.variants[0].color);
          setSelectedSize(prod.variants[0].size);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setError("No se pudo cargar el producto.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loader"></div>;
  if (error) return (
    <div className="container" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
      <p className="error-message">{error}</p>
      <Link to="/productos" className="btn btn-outline" style={{ marginTop: '1.25rem' }}>
        Volver a productos
      </Link>
    </div>
  );
  if (!product) return null;

  const uniqueColorsMap = new Map();
  if (product.variants) {
    product.variants.forEach(v => {
      if (!uniqueColorsMap.has(v.color)) {
        uniqueColorsMap.set(v.color, v.hex_color);
      }
    });
  }
  const uniqueColors = Array.from(uniqueColorsMap.entries()).map(([color, hex]) => ({ color, hex }));

  const uniqueSizes = product.variants ? [...new Set(product.variants.map(v => v.size))] : [];

  const selectedVariant = product.variants?.find(v => v.color === selectedColor && v.size === selectedSize);
  const variantStock = selectedVariant ? selectedVariant.stock : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const cartProduct = {
      id: product.id,
      variant_id: selectedVariant.id,
      name: `${product.name} - ${selectedColor} / ${selectedSize}`,
      price: product.price,
      image_url: product.image_url,
      stock: selectedVariant.stock
    };

    addToCart(cartProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2.5rem', marginTop: '3.75rem', marginBottom: '3.75rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '18.75rem' }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={{ width: '100%', borderRadius: '0.5rem' }} />
        ) : (
          <div style={{ width: '100%', aspectRatio: '4/5', background: '#eaeaea', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#888' }}>Sin imagen</span>
          </div>
        )}
      </div>
      
      <div style={{ flex: '1', minWidth: '18.75rem', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ fontSize: '0.85rem', color: 'var(--lulu-dark-gray)', marginBottom: '0.9375rem' }}>
          <Link to="/productos" style={{ textDecoration: 'underline' }}>Productos</Link>
          {product.category?.parent_name && (
            <> / <Link to={`/productos?categoria=${product.category.parent_name}`} style={{ textDecoration: 'underline' }}>{product.category.parent_name}</Link></>
          )}
          {product.category?.name && (
            <> / <Link to={`/productos?categoria=${product.category.parent_name || ''}&subcategoria=${product.category.name}`} style={{ textDecoration: 'underline' }}>{product.category.name}</Link></>
          )}
        </nav>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.9375rem' }}>{product.name}</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.875rem' }}>${parseFloat(product.price).toFixed(2)}</p>
        
        <div style={{ marginBottom: '1.875rem' }}>
          <p style={{ color: 'var(--lulu-dark-gray)' }}>{product.description || "Un producto diseñado para el máximo rendimiento y comodidad. Ideal para tu día a día o tus entrenamientos más intensos."}</p>
        </div>

        {uniqueColors.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.625rem' }}>Color: <span style={{ fontWeight: 'normal', color: 'var(--lulu-dark-gray)' }}>{selectedColor}</span></p>
            <div style={{ display: 'flex', gap: '0.9375rem' }}>
              {uniqueColors.map(c => (
                <button 
                  key={c.color}
                  onClick={() => setSelectedColor(c.color)}
                  title={c.color}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: selectedColor === c.color ? '0.125rem solid #000' : '0.0625rem solid #ddd',
                    outline: selectedColor === c.color ? '0.125rem solid #fff' : 'none',
                    outlineOffset: '-0.25rem',
                    cursor: 'pointer',
                    boxShadow: selectedColor === c.color ? '0 0 0 0.125rem #000' : 'none',
                    padding: 0
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {uniqueSizes.length > 0 && (
          <div style={{ marginBottom: '1.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>Talle: <span style={{ fontWeight: 'normal', color: 'var(--lulu-dark-gray)' }}>{selectedSize}</span></p>
              <span style={{ fontSize: '0.85rem', color: 'var(--lulu-dark-gray)', textDecoration: 'underline', cursor: 'pointer' }}>Guía de talles</span>
            </div>
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              {uniqueSizes.map(size => {
                const v = product.variants?.find(v => v.color === selectedColor && v.size === size);
                const hasStock = v && v.stock > 0;
                return (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!hasStock}
                    style={{
                      width: '3.75rem',
                      height: '2.5rem',
                      border: selectedSize === size ? '0.125rem solid #000' : '0.0625rem solid #ccc',
                      borderRadius: '0.25rem',
                      background: hasStock ? '#fff' : '#f5f5f5',
                      color: hasStock ? '#000' : '#aaa',
                      cursor: hasStock ? 'pointer' : 'not-allowed',
                      fontWeight: selectedSize === size ? 'bold' : 'normal',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {size}
                    {!hasStock && <div style={{ position: 'absolute', top: '50%', left: '-10%', width: '120%', height: '0.0625rem', background: '#aaa', transform: 'rotate(20deg)' }}></div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.9375rem' }}>
          <label style={{ fontWeight: 'bold' }}>Cantidad:</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '0.0625rem solid #ccc', borderRadius: '0.25rem', overflow: 'hidden' }}>
            <button 
              style={{ padding: '0.625rem 0.9375rem', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              -
            </button>
            <span style={{ padding: '0.625rem 1.25rem', fontSize: '1rem', borderLeft: '0.0625rem solid #ccc', borderRight: '0.0625rem solid #ccc' }}>
              {quantity}
            </span>
            <button 
              style={{ padding: '0.625rem 0.9375rem', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              onClick={() => setQuantity(q => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        {quantity > variantStock && (
          <p style={{ color: 'var(--lulu-red)', fontWeight: 'bold', marginBottom: '0.625rem' }}>
            No hay stock suficiente para esta cantidad.
          </p>
        )}

        <button 
          className="btn btn-black" 
          style={{ 
            padding: '1rem', 
            fontSize: '1.1rem', 
            marginBottom: '0.9375rem', 
            background: added ? '#4caf50' : (variantStock <= 0 || quantity > variantStock ? '#ccc' : ''), 
            borderColor: added ? '#4caf50' : (variantStock <= 0 || quantity > variantStock ? '#ccc' : ''),
            cursor: (variantStock <= 0 || quantity > variantStock) ? 'not-allowed' : 'pointer'
          }}
          onClick={handleAddToCart}
          disabled={variantStock <= 0 || quantity > variantStock}
        >
          {added ? '¡Agregado!' : (variantStock <= 0 ? 'Agotado en esta combinación' : 'Agregar al carrito')}
        </button>
        <button className="btn btn-outline" style={{ padding: '1rem', fontSize: '1.1rem' }}>
          Favoritos
        </button>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '0.0625rem solid var(--lulu-border)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--lulu-dark-gray)' }}>
            <strong>Disponibilidad:</strong> {variantStock > 0 ? "En stock" : "Agotado"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
