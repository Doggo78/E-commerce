// src/components/Cart.jsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0); // Nuevo estado para contar la cantidad en el carrito
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const user = await res.json();
          const cartItems = user.cart || [];
          setCart(cartItems);
          setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0)); // Calcular la cantidad total
        } else {
          const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
          setCart(cartItems);
          setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0)); // Calcular la cantidad total
        }
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartItems);
        setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0)); // Calcular la cantidad total
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/auth/user');
      if (res.ok) {
        if (cart.length === 0) {
          toast.info('Tu carrito está vacío.');
          return;
        }
        router.push('/webpay');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      router.push('/login');
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch('/api/auth/user');
      if (res.ok) {
        await fetch('/api/cart/clear', { method: 'POST' });
        setCart([]);
        setCartCount(0); // Vaciar la cantidad total
        toast.success('Carrito vaciado correctamente.');
      } else {
        localStorage.removeItem('cart');
        setCart([]);
        setCartCount(0); // Vaciar la cantidad total
        toast.success('Carrito vaciado correctamente.');
      }
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      toast.error('Hubo un error al vaciar el carrito. Por favor, intenta de nuevo.');
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error('La cantidad debe ser al menos 1.');
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      const totalQuantity = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity); // Actualizar la cantidad total
      if (!userIsAuthenticated()) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      toast.success('Cantidad actualizada.');
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      const totalQuantity = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity); // Actualizar la cantidad total
      if (!userIsAuthenticated()) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      toast.success('Producto eliminado del carrito.');
      return updatedCart;
    });
  };

  const userIsAuthenticated = () => {
    return cart.some((item) => item.userId);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-200">Carrito de Compras</h1>

      {/* Notificación de cantidad en el carrito */}
      {cartCount > 0 && (
        <div className="bg-green-100 text-green-900 p-4 rounded mb-6 text-center shadow-md">
          Tienes {cartCount} {cartCount === 1 ? 'producto' : 'productos'} en el carrito.
        </div>
      )}

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <img src="/empty-cart.png" alt="Carrito vacío" className="w-48 h-48 mb-4" />
          <p className="text-gray-500 text-xl">El carrito está vacío</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-300 rounded-lg shadow-md bg-white hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center mb-4 md:mb-0">
                <img
                  src={item.images && item.images.length > 0 ? item.images[0].url : '/placeholder.png'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded mr-6 border"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">Precio: <span className="font-bold text-green-600">${item.price.toFixed(2)}</span></p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div>
                  <label htmlFor={`quantity-${item.id}`} className="block text-sm font-medium text-gray-700">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    id={`quantity-${item.id}`}
                    name={`quantity-${item.id}`}
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="mt-1 block w-20 p-2 border border-gray-300 rounded-lg text-gray-900 font-semibold shadow-inner bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center text-red-500 hover:text-red-700 font-semibold"
                  aria-label={`Eliminar ${item.name}`}
                >
                  <FaTrash className="mr-1" /> Eliminar
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button
                onClick={handleCheckout}
                className="flex items-center bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-md"
              >
                <FaShoppingCart className="mr-2" /> Proceder al Pago
              </button>
              <button
                onClick={clearCart}
                className="flex items-center bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-md"
              >
                <FaTrash className="mr-2" /> Vaciar Carrito
              </button>
            </div>
            {/* Mostrar el total del carrito */}
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-800">
                Total: <span className="text-green-600">${calculateTotal()}</span>
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor de Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
