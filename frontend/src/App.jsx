import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import './App.css'; 

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      
      <footer style={{ background: '#fafafa', padding: '2.5rem', marginTop: '3.75rem', borderTop: '0.0625rem solid #e6e6e6', textAlign: 'center', color: '#4a4a4a', fontSize: '0.9rem' }}>
        <p>&copy; {new Date().getFullYear()} Midori's Flow. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

export default App;
