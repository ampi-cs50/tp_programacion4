import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const proceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', margin: '5rem auto' }}>
        <h1 className="section-title">Tu Carrito</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--lulu-dark-gray)', marginBottom: '1.875rem' }}>
          Tu carrito está vacío.
        </p>
        <Link to="/productos" className="btn btn-black" style={{ padding: '0.9375rem 1.875rem' }}>
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: '3.75rem auto', maxWidth: '62.5rem' }}>
      <h1 className="section-title">Tu Carrito ({cartCount} artículos)</h1>

      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '18.75rem' }}>
          {cartItems.map(item => (
            <div key={item.cartItemId} style={{ display: 'flex', gap: '1.25rem', borderBottom: '0.0625rem solid var(--lulu-border)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '7.5rem', height: '9.375rem', background: '#eaeaea', borderRadius: '0.25rem', overflow: 'hidden' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#999', fontSize: '0.7rem' }}>Sin imagen</span></div>
                )}
              </div>
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.625rem 0' }}>{item.name}</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <p style={{ color: 'var(--lulu-dark-gray)', margin: '0 0 0.3125rem 0' }}>Precio unitario: ${item.price.toFixed(2)}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9375rem', margin: '0.9375rem 0' }}>
                  <label style={{ color: 'var(--lulu-dark-gray)', fontSize: '0.9rem', fontWeight: 'bold' }}>Cantidad:</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '0.0625rem solid #ccc', borderRadius: '0.25rem', overflow: 'hidden' }}>
                    <button 
                      style={{ padding: '0.3125rem 0.75rem', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                      onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.3125rem 0.9375rem', fontSize: '0.9rem', borderLeft: '0.0625rem solid #ccc', borderRight: '0.0625rem solid #ccc' }}>
                      {item.quantity}
                    </span>
                    <button 
                      style={{ padding: '0.3125rem 0.75rem', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {item.quantity > item.stock && (
                  <p style={{ color: 'var(--lulu-red)', fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 0.625rem 0' }}>
                    No hay stock suficiente para esta cantidad.
                  </p>
                )}

                <div style={{ marginTop: 'auto' }}>
                  <button 
                    onClick={() => removeFromCart(item.cartItemId)}
                    style={{ background: 'none', border: 'none', color: 'var(--lulu-dark-gray)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: '1', minWidth: '18.75rem' }}>
          <div style={{ background: '#fafafa', padding: '1.875rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '1.25rem' }}>Resumen del Pedido</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.9375rem' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '0.0625rem solid var(--lulu-border)', paddingBottom: '1.25rem' }}>
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.875rem', fontWeight: 'bold', fontSize: '1.3rem' }}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-black" 
              style={{ 
                width: '100%', 
                padding: '1.125rem', 
                fontSize: '1.1rem',
                background: cartItems.some(item => item.quantity > item.stock) ? '#ccc' : '',
                borderColor: cartItems.some(item => item.quantity > item.stock) ? '#ccc' : '',
                cursor: cartItems.some(item => item.quantity > item.stock) ? 'not-allowed' : 'pointer'
              }}
              onClick={proceedToCheckout}
              disabled={cartItems.some(item => item.quantity > item.stock)}
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
