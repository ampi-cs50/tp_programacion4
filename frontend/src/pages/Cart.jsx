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
      <div className="container" style={{ textAlign: 'center', margin: '80px auto' }}>
        <h1 className="section-title">Tu Carrito</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--lulu-dark-gray)', marginBottom: '30px' }}>
          Tu carrito está vacío.
        </p>
        <Link to="/productos" className="btn btn-black" style={{ padding: '15px 30px' }}>
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: '60px auto', maxWidth: '1000px' }}>
      <h1 className="section-title">Tu Carrito ({cartCount} artículos)</h1>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '300px' }}>
          {cartItems.map(item => (
            <div key={item.cartItemId} style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--lulu-border)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ width: '120px', height: '150px', background: '#eaeaea', borderRadius: '4px', overflow: 'hidden' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{color:'#999', fontSize:'0.7rem'}}>Sin imagen</span></div>
                )}
              </div>
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>{item.name}</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <p style={{ color: 'var(--lulu-dark-gray)', margin: '0 0 5px 0' }}>Precio unitario: ${item.price.toFixed(2)}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '15px 0' }}>
                  <label style={{ color: 'var(--lulu-dark-gray)', fontSize: '0.9rem', fontWeight: 'bold' }}>Cantidad:</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                    <button 
                      style={{ padding: '5px 12px', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                      onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <span style={{ padding: '5px 15px', fontSize: '0.9rem', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }}>
                      {item.quantity}
                    </span>
                    <button 
                      style={{ padding: '5px 12px', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {item.quantity > item.stock && (
                  <p style={{ color: 'var(--lulu-red)', fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>
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

        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ background: '#fafafa', padding: '30px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '20px' }}>Resumen del Pedido</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--lulu-border)', paddingBottom: '20px' }}>
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 'bold', fontSize: '1.3rem' }}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-black" 
              style={{ 
                width: '100%', 
                padding: '18px', 
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
