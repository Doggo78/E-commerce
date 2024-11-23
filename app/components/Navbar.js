"use client"
import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../utils/authContext';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaHome, FaCogs, FaBars, FaTimes } from 'react-icons/fa';
import { GiNinjaHead } from 'react-icons/gi';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const userData = await res.json();
          const cartItems = userData.cart || [];
          setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
        } else {
          const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
          setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
        }
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    };

    fetchCartCount();
  }, []);

  return (
    <nav className="bg-[#303030] text-white p-4 shadow-lg flex justify-between items-center border-b-4 border-yellow-400">
      <div className="flex items-center space-x-4">
        <GiNinjaHead className="text-4xl animate-pulse" />
        <Link href="/" className="text-3xl font-extrabold hover:text-yellow-300 transition transform hover:scale-110">
          AnimeStore
        </Link>
      </div>

      {/* Botón de Hamburguesa y Carrito en Móvil */}
      <div className="lg:hidden flex items-center space-x-4">
        <Link href="/cart" className="relative">
          <div className="bg-yellow-500 p-2 rounded-full shadow-lg hover:bg-yellow-600 transition transform hover:scale-105">
            <FaShoppingCart className="text-2xl text-white" />
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
        </Link>
        <button onClick={toggleMenu} className="text-3xl focus:outline-none">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú en Pantallas Grandes */}
      <div className={`hidden lg:flex items-center space-x-8`}>
        <Link href="/" className="hover:text-yellow-300 transition flex items-center space-x-2 transform hover:scale-110">
          <FaHome className="text-2xl" />
          <span className="font-bold">Inicio</span>
        </Link>

        <Link href="/cart" className="relative hover:text-yellow-300 transition flex items-center space-x-2 transform hover:scale-110">
          <div className="bg-yellow-500 p-2 rounded-full shadow-lg hover:bg-yellow-600 transition transform hover:scale-105">
            <FaShoppingCart className="text-2xl text-white" />
          </div>
          <span className="font-bold">Carrito</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <span className="flex items-center space-x-2 transform hover:scale-110">
              <FaUserCircle className="text-2xl" />
              <span className="font-bold">Hola, {user.name}</span>
            </span>
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="hover:text-yellow-300 transition flex items-center space-x-2 transform hover:scale-110">
                <FaCogs className="text-2xl" />
                <span className="font-bold">Administración</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 transition px-4 py-2 rounded-lg flex items-center space-x-2 font-bold transform hover:scale-110 shadow-md"
            >
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-yellow-300 transition flex items-center space-x-2 transform hover:scale-110">
              <FaUserCircle className="text-2xl" />
              <span className="font-bold">Iniciar Sesión</span>
            </Link>
            <Link href="/register" className="hover:text-yellow-300 transition font-bold transform hover:scale-110">
              Registrarse
            </Link>
          </>
        )}
      </div>

      {/* Menú desplegable para móvil */}
      {menuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-gradient-to-r from-purple-700 to-pink-600 p-4 z-10 flex flex-col space-y-4">
          <Link href="/" className="hover:text-yellow-300 transition flex items-center space-x-2 transform hover:scale-110">
            <FaHome className="text-2xl" />
            <span className="font-bold">Inicio</span>
          </Link>
          {user && (
            <span className="flex items-center space-x-2 transform hover:scale-110">
              <FaUserCircle className="text-2xl" />
              <span className="font-bold">Hola, {user.name}</span>
            </span>
          )}
          {user && user.role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-yellow-300 transition flex items-center space-x-2 transform hover:scale-110">
              <FaCogs className="text-2xl" />
              <span className="font-bold">Administración</span>
            </Link>
          )}
          {!user && (
            <>
              <Link href="/login" className="hover:text-yellow-300 transition flex items-center space-x-2 transform hover:scale-110">
                <FaUserCircle className="text-2xl" />
                <span className="font-bold">Iniciar Sesión</span>
              </Link>
              <Link href="/register" className="hover:text-yellow-300 transition font-bold transform hover:scale-110">
                Registrarse
              </Link>
            </>
          )}
          {user && (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 transition px-4 py-2 rounded-lg flex items-center space-x-2 font-bold transform hover:scale-110 shadow-md"
            >
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
