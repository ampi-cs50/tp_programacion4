import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

describe('Cart Component - Shopping Cart User Interaction Tests', () => {
  const mockRemoveFromCart = vi.fn();
  const mockUpdateQuantity = vi.fn();

  const sampleItems = [
    {
      cartItemId: '1-10',
      product_id: 1,
      variant_id: 10,
      name: 'Leggings Align™ Tiro Alto 25" - Negro / S',
      price: 38000,
      quantity: 2,
      stock: 10,
      image_url: '/products/align_leggings.jpg'
    }
  ];

  const renderCart = (items = sampleItems) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    return render(
      <AuthContext.Provider value={{ isAuthenticated: true }}>
        <CartContext.Provider
          value={{
            cartItems: items,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            cartTotal: total,
            cartCount: count
          }}
        >
          <MemoryRouter>
            <Cart />
          </MemoryRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );
  };

  it('renders empty cart view when no items are present', () => {
    renderCart([]);

    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver a la tienda/i })).toBeInTheDocument();
  });

  it('renders cart items, quantities and price summary correctly', () => {
    renderCart();

    expect(screen.getByText(/Leggings Align™ Tiro Alto 25" - Negro \/ S/i)).toBeInTheDocument();
    expect(screen.getAllByText('$76000.00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Tu Carrito (2 artículos)')).toBeInTheDocument();
  });

  it('interacts with quantity increment and decrement buttons', () => {
    renderCart();

    const incrementBtn = screen.getByRole('button', { name: '+' });
    const decrementBtn = screen.getByRole('button', { name: '-' });

    fireEvent.click(incrementBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1-10', 3);

    fireEvent.click(decrementBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1-10', 1);
  });

  it('triggers item removal when clicking Eliminar', () => {
    renderCart();

    const removeBtn = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(removeBtn);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('1-10');
  });
});
