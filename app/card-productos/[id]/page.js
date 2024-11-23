// app/card-productos/[id]/page.js

'use client';

import { useState, useEffect, useContext, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Slider from 'react-slick';
import { AuthContext } from '../../utils/authContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function ProductDetailPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
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

  // Obtener los detalles del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          // Calcular la puntuación promedio
          if (data.ratings && data.ratings.length > 0) {
            const total = data.ratings.reduce((acc, rating) => acc + rating.stars, 0);
            const avg = (total / data.ratings.length).toFixed(1);
            setAverageRating(avg);
          } else {
            setAverageRating('No hay puntuaciones');
          }
        } else {
          Swal.fire('Error', 'Producto no encontrado', 'error');
          router.push('/card-productos'); // Redirigir a la lista de productos
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        Swal.fire('Error', 'Hubo un error al cargar el producto', 'error');
        router.push('/card-productos');
      }
    };

    fetchProduct();
  }, [id, router]);

  // Obtener información de "likes" del producto
  useEffect(() => {
    const fetchLikes = async () => {
      if (!product) {
        setIsLoadingLikes(false);
        return;
      }
      try {
        const res = await fetch(`/api/products/${product.id}/likes`);
        if (res.ok) {
          const data = await res.json();
          setTotalLikes(data.totalLikes);
          if (user) {
            setLiked(data.userHasLiked);
          }
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
  const handleAddToCart = () => {
    try {
      const qty = parseInt(quantity);
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
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setQuantity(num);
    }
  };

  // Manejar el evento de dar "like" o "unlike"
  const handleLikeToggle = async (e) => {
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

  // Si `product` no está definido, mostrar un spinner o un mensaje de carga
  if (!product) {
    return <p className="text-center text-muted">Cargando producto...</p>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        {/* Sección de Imágenes */}
        <div className="col-md-6">
          <Slider {...settings} ref={sliderRef}>
            {product.images && product.images.length > 0 ? (
              product.images.map((image) => (
                <div key={image.id} className="d-flex justify-content-center align-items-center h-100">
                  <img
                    src={image.url}
                    alt={product.name}
                    className="img-fluid"
                    style={{
                      objectFit: "contain",
                      maxWidth: "100%",
                      maxHeight: "500px",
                      width: "auto",
                      height: "auto",
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-muted">No hay imágenes disponibles</div>
            )}
          </Slider>
        </div>

        {/* Sección de Detalles */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4>Precio: ${product.price.toFixed(2)}</h4>
          <p>Puntuación promedio: {averageRating} ⭐</p>

          {/* Selector de Cantidad */}
          <div className="d-flex align-items-center mb-3">
            <label htmlFor="quantity" className="mr-2">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="form-control text-center"
              style={{
                width: "80px",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>

          {/* Botón de Añadir al Carrito */}
          <button
            onClick={handleAddToCart}
            className="btn btn-warning mb-3"
          >
            Añadir al Carrito
          </button>

          {/* Notificación de Añadido al Carrito */}
          {notification && (
            <div className="alert alert-success" role="alert">
              {notification}
            </div>
          )}

          {/* Botón de Like */}
          <div className="mb-3">
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

          {/* Sistema de Puntuación */}
          <div className="mb-3">
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

          {/* Información de Stock */}
          <p>Stock disponible: {product.stock}</p>
        </div>
      </div>
    </div>
  );
}
