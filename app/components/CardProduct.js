// components/CardProduct.js

'use client';

import Link from 'next/link';
import Slider from 'react-slick';
import { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../utils/authContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';

export default function CardProduct({ product }) {
  const { user } = useContext(AuthContext);
  const [averageRating, setAverageRating] = useState(null);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isLoadingLikes, setIsLoadingLikes] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState('');

  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  // Calcular la puntuación promedio
  useEffect(() => {
    if (product && Array.isArray(product.ratings) && product.ratings.length > 0) {
      const total = product.ratings.reduce((acc, rating) => acc + rating.stars, 0);
      const avg = (total / product.ratings.length).toFixed(1);
      setAverageRating(avg);
    } else if (product) {
      setAverageRating('No hay puntuaciones');
    }
  }, [product]);

  // Obtener información de "likes" del producto
  useEffect(() => {
    const fetchLikes = async () => {
      if (!product || !product.id) {
        setIsLoadingLikes(false);
        return;
      }
      try {
        const res = await fetch(`/api/products/${product.id}/likes`);
        if (res.ok) {
          const data = await res.json();
          setTotalLikes(data.totalLikes || 0);
          setLiked(data.userHasLiked || false);
        } else {
          console.error('Error al obtener likes del producto');
        }
      } catch (error) {
        console.error('Error al obtener likes del producto:', error);
      } finally {
        setIsLoadingLikes(false);
      }
    };
    fetchLikes();
  }, [product, user]);

  // Manejar el evento de añadir al carrito
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation
    try {
      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || qty < 1) {
        Swal.fire('Error', 'Por favor, ingresa una cantidad válida (mínimo 1).', 'error');
        return;
      }

      if (qty > product.stock) {
        Swal.fire('Error', `Solo hay ${product.stock} unidades disponibles.`, 'error');
        return;
      }

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingProductIndex = cart.findIndex(item => item.id === product.id);

      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += qty;
      } else {
        cart.push({ 
          ...product, 
          images: product.images || [{ id: 1, url: product.imageUrl }], 
          quantity: qty 
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      setNotification(`Añadiste ${qty} unidad(es) de "${product.name}" al carrito.`);
      setTimeout(() => setNotification(''), 3000);

    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      Swal.fire('Error', 'Hubo un error al añadir el producto al carrito. Por favor, intenta de nuevo.', 'error');
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setQuantity(num);
    }
  };

  // Manejar el evento de dar "like" o "unlike"
  const handleLikeToggle = async (e) => {
    e.stopPropagation(); // Prevent navigation
    e.preventDefault();
    if (!user) {
      Swal.fire('Error', 'Debes iniciar sesión para dar "like" a un producto.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/products/${product.id}/likes`, {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(data.userHasLiked);
        setTotalLikes(data.totalLikes);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar el like');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  // Función para manejar la puntuación
  const handleRatingSubmit = async (stars, e) => {
    e.stopPropagation(); // Prevent navigation
    e.preventDefault();
    if (!user) {
      Swal.fire('Error', 'Debes iniciar sesión para calificar un producto.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/products/${product.id}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars }),
      });

      if (res.ok) {
        const data = await res.json();
        setAverageRating(data.newAverageRating);
        Swal.fire('Gracias', 'Has calificado el producto exitosamente.', 'success');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al calificar el producto');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  // Si `product` no está definido o no tiene `id`, mostrar un placeholder o spinner
  if (!product || !product.id) {
    return (
      <div className="card shadow-sm mb-4" style={{ backgroundColor: "#202121", color: "#fff", borderRadius: "8px" }}>
        <div className="card-body text-center">
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/card-productos/${product.id}`} className="text-decoration-none text-dark">
      <div className="card shadow-sm mb-4" style={{ backgroundColor: "#202121", color: "#fff", borderRadius: "8px", cursor: "pointer" }}>
        <div className="card-header text-center" style={{ backgroundColor: "#303030", borderBottom: "1px solid #444" }}>
          <h2 className="h5">{product.name}</h2>
        </div>
        <div className="card-body p-0">
          {/* Carrusel de imágenes */}
          <div
            className="position-relative w-100 d-flex justify-content-center align-items-center"
            style={{
              height: "300px",
              backgroundColor: "#333",
              borderRadius: "8px",
            }}
          >
            {/* Flechas de navegación */}
            <button
              className="carousel-control-prev"
              type="button"
              onClick={(e) => { e.stopPropagation(); sliderRef.current.slickPrev(); }}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
              }}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>

            <Slider {...settings} ref={sliderRef} className="h-100 w-100">
              {product.images && product.images.length > 0 ? (
                product.images.map((image) => (
                  <div key={image.id} className="d-flex justify-content-center align-items-center h-100">
                    <Image
                      src={image.url}
                      alt={product.name}
                      width={500}
                      height={300}
                      objectFit="contain"
                      className="img-fluid"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center text-muted">No hay imágenes disponibles</div>
              )}
            </Slider>

            {/* Flecha siguiente */}
            <button
              className="carousel-control-next"
              type="button"
              onClick={(e) => { e.stopPropagation(); sliderRef.current.slickNext(); }}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
              }}
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>

          <div className="p-3">
            <p className="text-muted text-center mb-2">{product.description}</p>
            <p className="text-center font-weight-bold mb-2">Precio: ${product.price.toFixed(2)}</p>
            <p className="text-center mb-4">Puntuación promedio: {averageRating} ⭐</p>

            {/* Selector de Cantidad */}
            <div className="d-flex justify-content-center mb-4">
              <label htmlFor={`quantity-${product.id}`} className="mr-2">Cantidad:</label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                name={`quantity-${product.id}`}
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="form-control text-center"
                style={{
                  width: "80px",
                  backgroundColor: "#303030",
                  color: "#fff",
                  border: "1px solid #444",
                }}
              />
            </div>

            {/* Botón de Añadir al Carrito */}
            <div className="d-flex justify-content-center mb-4">
              <button
                onClick={handleAddToCart}
                className="btn btn-warning text-dark font-weight-bold"
                style={{ width: "160px", borderRadius: "25px" }}
              >
                Añadir al Carrito
              </button>
            </div>

            {/* Notificación de Añadido al Carrito */}
            {notification && (
              <div className="alert alert-success text-center" role="alert">
                {notification}
              </div>
            )}

            {/* Sistema de puntuación */}
            <div className="text-center mb-4">
              <h5>Califica este producto:</h5>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="btn btn-link text-warning"
                  onClick={(e) => handleRatingSubmit(star, e)}
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Botón de Like para usuarios autenticados */}
            <div className="text-center mb-4">
              {isLoadingLikes ? (
                <p className="text-muted">Cargando likes...</p>
              ) : (
                <button
                  onClick={handleLikeToggle}
                  className="btn btn-link text-danger"
                >
                  {liked ? <FaHeart /> : <FaRegHeart />} {totalLikes}{" "}
                  {totalLikes === 1 ? "Like" : "Likes"}
                </button>
              )}
            </div>
          </div>
        </div>
        </div>
      </Link>
    );}