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
  if (error) return <div className="container" style={{textAlign: 'center', marginTop: '40px'}}><p className="error-message">{error}</p><Link to="/productos" className="btn btn-outline" style={{marginTop: '20px'}}>Volver a productos</Link></div>;
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
    
    // Pasamos el producto incluyendo la info de la variante
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

        {/* Selector de Color */}
        {uniqueColors.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Color: <span style={{ fontWeight: 'normal', color: 'var(--lulu-dark-gray)' }}>{selectedColor}</span></p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {uniqueColors.map(c => (
                <button 
                  key={c.color}
                  onClick={() => setSelectedColor(c.color)}
                  title={c.color}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: selectedColor === c.color ? '2px solid #000' : '1px solid #ddd',
                    outline: selectedColor === c.color ? '2px solid #fff' : 'none',
                    outlineOffset: '-4px',
                    cursor: 'pointer',
                    boxShadow: selectedColor === c.color ? '0 0 0 2px #000' : 'none',
                    padding: 0
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Selector de Talle */}
        {uniqueSizes.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>Talle: <span style={{ fontWeight: 'normal', color: 'var(--lulu-dark-gray)' }}>{selectedSize}</span></p>
              <span style={{ fontSize: '0.85rem', color: 'var(--lulu-dark-gray)', textDecoration: 'underline', cursor: 'pointer' }}>Guía de talles</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {uniqueSizes.map(size => {
                // Verificar si esta combinación (color seleccionado + este talle) tiene stock
                const v = product.variants?.find(v => v.color === selectedColor && v.size === size);
                const hasStock = v && v.stock > 0;
                return (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!hasStock}
                    style={{
                      width: '60px',
                      height: '40px',
                      border: selectedSize === size ? '2px solid #000' : '1px solid #ccc',
                      borderRadius: '4px',
                      background: hasStock ? '#fff' : '#f5f5f5',
                      color: hasStock ? '#000' : '#aaa',
                      cursor: hasStock ? 'pointer' : 'not-allowed',
                      fontWeight: selectedSize === size ? 'bold' : 'normal',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {size}
                    {!hasStock && <div style={{ position: 'absolute', top: '50%', left: '-10%', width: '120%', height: '1px', background: '#aaa', transform: 'rotate(20deg)' }}></div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Cantidad:</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
            <button 
              style={{ padding: '10px 15px', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              -
            </button>
            <span style={{ padding: '10px 20px', fontSize: '1rem', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }}>
              {quantity}
            </span>
            <button 
              style={{ padding: '10px 15px', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              onClick={() => setQuantity(q => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        {quantity > variantStock && (
          <p style={{ color: 'var(--lulu-red)', fontWeight: 'bold', marginBottom: '10px' }}>
            No hay stock suficiente para esta cantidad.
          </p>
        )}

        <button 
          className="btn btn-black" 
          style={{ 
            padding: '16px', 
            fontSize: '1.1rem', 
            marginBottom: '15px', 
            background: added ? '#4caf50' : (variantStock <= 0 || quantity > variantStock ? '#ccc' : ''), 
            borderColor: added ? '#4caf50' : (variantStock <= 0 || quantity > variantStock ? '#ccc' : ''),
            cursor: (variantStock <= 0 || quantity > variantStock) ? 'not-allowed' : 'pointer'
          }}
          onClick={handleAddToCart}
          disabled={variantStock <= 0 || quantity > variantStock}
        >
          {added ? '¡Agregado!' : (variantStock <= 0 ? 'Agotado en esta combinación' : 'Agregar al carrito')}
        </button>
        <button className="btn btn-outline" style={{ padding: '16px', fontSize: '1.1rem' }}>
          Favoritos
        </button>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--lulu-border)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--lulu-dark-gray)' }}>
            <strong>Disponibilidad:</strong> {variantStock > 0 ? "En stock" : "Agotado"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
