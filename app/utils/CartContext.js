import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Cargar el carrito desde localStorage o backend cuando se monta la app
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const userData = await res.json();
          const cartItems = userData.cart || [];
          setCart(cartItems);
          setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
        } else {
          const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
          setCart(cartItems);
          setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
        }
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartItems);
        setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
      }
    };

    fetchCart();
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    setCartCount(newCart.reduce((acc, item) => acc + item.quantity, 0));
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};
