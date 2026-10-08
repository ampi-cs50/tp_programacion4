import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
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
        </Routes>
      </main>
      
      <footer style={{ background: '#fafafa', padding: '40px', marginTop: '60px', borderTop: '1px solid #e6e6e6', textAlign: 'center', color: '#4a4a4a', fontSize: '0.9rem' }}>
        <p>&copy; {new Date().getFullYear()} Lulutienda. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

export default App;
