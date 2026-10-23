import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api/v1';

function Checkout() {
  const { cartItems, clearCart, cartTotal } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const [deliveryMethod, setDeliveryMethod] = useState('shipping');

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (cartItems.length === 0 && !success) {
      navigate('/carrito');
    }
  }, [isAuthenticated, cartItems.length, navigate, success]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'firstName' || name === 'lastName' || name === 'city') {
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }

    if (name === 'zip') {
      value = value.replace(/\D/g, '').substring(0, 5);
    }

    if (name === 'cardCvc') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    if (name === 'cardNumber') {
      let val = value.replace(/\D/g, '');
      val = val.substring(0, 16);
      const parts = [];
      for (let i = 0; i < val.length; i += 4) {
        parts.push(val.substring(i, i + 4));
      }
      value = parts.join(' ');
    }

    if (name === 'cardExpiry') {
      let val = value.replace(/\D/g, '');
      if (val.length > 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      value = val.substring(0, 5);
    }

    setFormData({ ...formData, [name]: value });
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.firstName.trim().length < 2) errors.firstName = "Nombre inválido";
    if (formData.lastName.trim().length < 2) errors.lastName = "Apellido inválido";
    
    if (deliveryMethod === 'shipping') {
      if (formData.address.trim().length < 5) errors.address = "Dirección muy corta";
      if (formData.city.trim().length < 3) errors.city = "Ciudad inválida";
      if (formData.zip.length < 4) errors.zip = "CP inválido";
    }
    
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      errors.cardNumber = "La tarjeta debe tener 16 números";
    }

    if (formData.cardCvc.length < 3) {
      errors.cardCvc = "CVC inválido";
    }

    if (formData.cardExpiry.length !== 5) {
      errors.cardExpiry = "Formato MM/AA";
    } else {
      const [month, year] = formData.cardExpiry.split('/');
      const numMonth = parseInt(month, 10);
      const numYear = parseInt(year, 10);
      
      const today = new Date();
      const currentYear = parseInt(today.getFullYear().toString().slice(2), 10);
      const currentMonth = today.getMonth() + 1;

      if (numMonth < 1 || numMonth > 12) {
        errors.cardExpiry = "Mes inválido";
      } else if (numYear < currentYear || (numYear === currentYear && numMonth < currentMonth)) {
        errors.cardExpiry = "Tarjeta vencida";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario antes de continuar.');
      return;
    }

    setLoading(true);

    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity
    }));

    try {
      const response = await axios.post(`${API_URL}/orders`, { order_items: orderItems });
      if (response.status === 201) {
        setSuccess('¡Pago aprobado! Tu pedido ha sido confirmado.');
        clearCart();
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Hubo un error al procesar tu tarjeta. Revisa tus fondos e intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ textAlign: 'center', margin: '5rem auto', maxWidth: '37.5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>✅</div>
        <h1 className="section-title">¡Compra Exitosa!</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--lulu-dark-gray)', marginBottom: '1.875rem' }}>
          {success}
          <br/>
          Te enviamos un correo electrónico con los detalles del envío.
        </p>
        <Link to="/productos" className="btn btn-black" style={{ padding: '0.9375rem 1.875rem' }}>
          Seguir comprando
        </Link>
      </div>
    );
  }

  const InputError = ({ msg }) => msg ? <div style={{ color: 'var(--lulu-red)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{msg}</div> : null;

  return (
    <div className="container" style={{ margin: '3.75rem auto', maxWidth: '62.5rem' }}>
      <h1 className="section-title">Finalizar Compra</h1>

      {error && (
        <div style={{ background: '#fef2f2', border: '0.0625rem solid #ef4444', color: '#b91c1c', padding: '0.625rem', borderRadius: '0.25rem', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap-reverse' }}>
        <div style={{ flex: '2', minWidth: '18.75rem' }}>
          <form onSubmit={handleCheckout} noValidate>
            <h2 style={{ fontSize: '1.3rem', borderBottom: '0.0625rem solid #ddd', paddingBottom: '0.625rem', marginBottom: '1.25rem' }}>1. Método de Entrega</h2>
            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <label style={{ flex: 1, border: deliveryMethod === 'shipping' ? '0.125rem solid #000' : '0.0625rem solid #ccc', padding: '0.9375rem', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center', background: deliveryMethod === 'shipping' ? '#fafafa' : '#fff' }}>
                <input type="radio" name="deliveryMethod" value="shipping" checked={deliveryMethod === 'shipping'} onChange={() => setDeliveryMethod('shipping')} style={{ display: 'none' }} />
                <div style={{ fontWeight: 'bold', marginBottom: '0.3125rem' }}>Envío a Domicilio</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--lulu-dark-gray)' }}>Llega en 3-5 días hábiles</div>
              </label>
              <label style={{ flex: 1, border: deliveryMethod === 'pickup' ? '0.125rem solid #000' : '0.0625rem solid #ccc', padding: '0.9375rem', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center', background: deliveryMethod === 'pickup' ? '#fafafa' : '#fff' }}>
                <input type="radio" name="deliveryMethod" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} style={{ display: 'none' }} />
                <div style={{ fontWeight: 'bold', marginBottom: '0.3125rem' }}>Retiro en Tienda</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--lulu-dark-gray)' }}>Gratis y rápido</div>
              </label>
            </div>

            <h2 style={{ fontSize: '1.3rem', borderBottom: '0.0625rem solid #ddd', paddingBottom: '0.625rem', marginBottom: '1.25rem' }}>2. Mis Datos</h2>
            <div style={{ display: 'flex', gap: '0.9375rem', marginBottom: '0.9375rem' }}>
              <div className="form-group" style={{ flex: '1' }}>
                <label>Nombre</label>
                <input type="text" name="firstName" className="form-control" required value={formData.firstName} onChange={handleChange} />
                <InputError msg={formErrors.firstName} />
              </div>
              <div className="form-group" style={{ flex: '1' }}>
                <label>Apellido</label>
                <input type="text" name="lastName" className="form-control" required value={formData.lastName} onChange={handleChange} />
                <InputError msg={formErrors.lastName} />
              </div>
            </div>

            {deliveryMethod === 'shipping' && (
              <>
                <div className="form-group">
                  <label>Dirección</label>
                  <input type="text" name="address" className="form-control" placeholder="Calle y número" required value={formData.address} onChange={handleChange} />
                  <InputError msg={formErrors.address} />
                </div>
                <div style={{ display: 'flex', gap: '0.9375rem', marginBottom: '2.5rem' }}>
                  <div className="form-group" style={{ flex: '2' }}>
                    <label>Ciudad / Localidad</label>
                    <input type="text" name="city" className="form-control" required value={formData.city} onChange={handleChange} />
                    <InputError msg={formErrors.city} />
                  </div>
                  <div className="form-group" style={{ flex: '1' }}>
                    <label>Código Postal</label>
                    <input type="text" name="zip" className="form-control" placeholder="Ej: 1425" required value={formData.zip} onChange={handleChange} />
                    <InputError msg={formErrors.zip} />
                  </div>
                </div>
              </>
            )}

            <h2 style={{ fontSize: '1.3rem', borderBottom: '0.0625rem solid #ddd', paddingBottom: '0.625rem', marginBottom: '1.25rem' }}>2. Método de Pago</h2>
            <div className="form-group">
              <label>Número de Tarjeta</label>
              <input type="text" name="cardNumber" className="form-control" placeholder="0000 0000 0000 0000" required value={formData.cardNumber} onChange={handleChange} />
              <InputError msg={formErrors.cardNumber} />
            </div>
            <div style={{ display: 'flex', gap: '0.9375rem', marginBottom: '1.875rem' }}>
              <div className="form-group" style={{ flex: '1' }}>
                <label>Vencimiento</label>
                <input type="text" name="cardExpiry" className="form-control" placeholder="MM/AA" required value={formData.cardExpiry} onChange={handleChange} />
                <InputError msg={formErrors.cardExpiry} />
              </div>
              <div className="form-group" style={{ flex: '1' }}>
                <label>Código de Seguridad</label>
                <input type="password" name="cardCvc" className="form-control" placeholder="CVC" required value={formData.cardCvc} onChange={handleChange} />
                <InputError msg={formErrors.cardCvc} />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-black" 
              style={{ width: '100%', padding: '1.125rem', fontSize: '1.2rem' }}
              disabled={loading}
            >
              {loading ? 'Procesando pago...' : `Pagar $${cartTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div style={{ flex: '1', minWidth: '18.75rem' }}>
          <div style={{ background: '#fafafa', padding: '1.875rem', borderRadius: '0.5rem', position: 'sticky', top: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginTop: 0, marginBottom: '1.25rem' }}>Resumen</h2>
            
            <div style={{ marginBottom: '1.25rem', borderBottom: '0.0625rem solid #ddd', paddingBottom: '0.9375rem' }}>
              {cartItems.map(item => (
                <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem', fontSize: '0.9rem' }}>
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.9375rem', color: 'var(--lulu-dark-gray)' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--lulu-dark-gray)' }}>
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.3rem', borderTop: '0.0625rem solid #ddd', paddingTop: '0.9375rem' }}>
              <span>Total a pagar</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
