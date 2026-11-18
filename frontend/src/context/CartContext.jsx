import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { getProductImageUrl } from '../utils/imageHelper';

export const CartContext = createContext();

function loadCartFromStorage(storageKey) {
  const savedCart = localStorage.getItem(storageKey);
  if (!savedCart) return [];
  try {
    const items = JSON.parse(savedCart);
    return Array.isArray(items) ? items.map(item => ({
      ...item,
      image_url: getProductImageUrl(item) || item.image_url
    })) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const auth = useContext(AuthContext);
  const userEmail = auth?.userEmail || null;
  const storageKey = userEmail ? `shopping_cart_${userEmail.toLowerCase()}` : 'shopping_cart_guest';

  const [cartItems, setCartItems] = useState(() => loadCartFromStorage(storageKey));
  const activeKeyRef = useRef(storageKey);

  // Al cambiar de usuario (login / logout), cargar el carrito exclusivo de ese usuario
  useEffect(() => {
    if (activeKeyRef.current !== storageKey) {
      const userCart = loadCartFromStorage(storageKey);
      activeKeyRef.current = storageKey;
      setCartItems(userCart);
    }
  }, [storageKey]);

  // Guardar en localStorage únicamente en la clave del usuario activo actual
  useEffect(() => {
    if (activeKeyRef.current === storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, storageKey]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const cartItemId = product.variant_id ? `${product.id}-${product.variant_id}` : product.id;
      const imageUrl = getProductImageUrl(product) || product.image_url;
      
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity, stock: product.stock, image_url: imageUrl || item.image_url }
            : item
        );
      }
      return [...prevItems, { 
        cartItemId: cartItemId,
        product_id: product.id, 
        variant_id: product.variant_id,
        name: product.name,
        price: parseFloat(product.price),
        image_url: imageUrl,
        stock: product.stock,
        quantity: quantity 
      }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => prevItems.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}
