// src/components/ProductItem.jsx

'use client';

import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS
import '../../app/globals.css'; // Asegúrate de que Tailwind esté configurado aquí

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../utils/authContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Carousel, Button, Modal, Form } from 'react-bootstrap';

export default function ProductItem({ product }) {
  const { user } = useContext(AuthContext); // Uso de 'user' para la autenticación
  const [averageRating, setAverageRating] = useState(null);
  const [liked, setLiked] = useState(false); // Estado de "like" del usuario
  const [totalLikes, setTotalLikes] = useState(0); // Total de "likes" del producto
  const [isLoadingLikes, setIsLoadingLikes] = useState(true); // Estado de carga de likes
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad
  const [showModal, setShowModal] = useState(false); // Estado para controlar la apertura del modal

  // Calcular la puntuación promedio
  useEffect(() => {
    if (product.ratings && product.ratings.length > 0) {
      const total = product.ratings.reduce((acc, rating) => acc + rating.stars, 0);
      const avg = (total / product.ratings.length).toFixed(1);
      setAverageRating(avg);
    } else {
      setAverageRating('No hay puntuaciones');
    }
  }, [product.ratings]);

  // Manejar el evento de añadir al carrito
  const handleAddToCart = () => {
    try {
      const qty = parseInt(quantity);
      if (isNaN(qty) || qty < 1) {
        toast.error('Por favor, ingresa una cantidad válida (mínimo 1).');
        return;
      }

      if (qty > product.stock) {
        toast.error(`Solo hay ${product.stock} unidades disponibles.`);
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

      toast.success(`Has añadido ${qty} unidad(es) de "${product.name}" al carrito.`);
      setQuantity(1); // Resetear cantidad después de añadir
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      toast.error('Hubo un error al añadir el producto al carrito. Por favor, intenta de nuevo.');
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

  // Obtener información de "likes" del producto
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/likes/${product.id}`);
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
  }, [product.id, user]);

  // Manejar el evento de dar "like" o "unlike"
  const handleLikeToggle = async () => {
    if (!user) {
      toast.info('Debes iniciar sesión para dar "like" a un producto.');
      return;
    }

    try {
      const res = await fetch(`/api/likes/${product.id}`, {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(data.userHasLiked);
        setTotalLikes(data.totalLikes);
        toast.success(liked ? 'Has eliminado tu like' : 'Has dado like al producto');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar el like');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Manejar el envío de la calificación
  const handleRatingSubmit = async (star) => {
    if (!user) {
      toast.info('Debes iniciar sesión para calificar un producto.');
      return;
    }

    try {
      const res = await fetch(`/api/ratings/${product.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars: star }),
      });

      if (res.ok) {
        const data = await res.json();
        setAverageRating(data.newAverageRating.toFixed(1));
        toast.success(`Has calificado con ${star} estrella(s)`);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al enviar la calificación');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Card className="bg-gray-800 text-white mb-4 shadow-lg" style={{ borderRadius: '0.5rem', maxWidth: '400px', height: '100%' }}>
        {/* Header del Producto */}
        <Card.Header className="bg-gray-700 text-center">
          <Card.Title className="text-2xl font-bold">{product.name}</Card.Title>
        </Card.Header>

        {/* Carrusel de Imágenes */}
        <Carousel variant="dark">
          {product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <Carousel.Item key={image.id}>
                <img
                  src={image.url}
                  className="d-block w-100"
                  alt={product.name}
                  style={{ height: '300px', objectFit: 'contain' }}
                />
              </Carousel.Item>
            ))
          ) : (
            <Carousel.Item>
              <div className="d-flex justify-content-center align-items-center" style={{ height: '300px', backgroundColor: '#4a4a4a' }}>
                <span className="text-gray-400">No hay imágenes disponibles</span>
              </div>
            </Carousel.Item>
          )}
        </Carousel>

        {/* Detalles del Producto */}
        <Card.Body className="d-flex flex-column align-items-center">
          {/* Precio y Puntuación */}
          <Card.Title className="text-center text-lg font-bold mb-2">
            Precio: <span className="text-green-500">${product.price.toFixed(2)}</span>
          </Card.Title>
          

          {/* Selector de Cantidad */}
          <Form.Group className="d-flex justify-content-center align-items-center mb-4" controlId={`quantity-${product.id}`}>
            <Form.Label className="me-2 text-gray-300">Cantidad:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: '80px', textAlign: 'center' }}
            />
          </Form.Group>

          {/* Botón de Añadir al Carrito */}
          <Button
            variant="warning"
            className="text-dark fw-bold px-4 py-2 rounded-full mb-4"
            onClick={handleAddToCart}
          >
            Añadir al Carrito
          </Button>

          {/* Botón "Saber Más" */}
          <Button
            variant="secondary"
            className="fw-bold px-4 py-2 rounded-full mb-4"
            onClick={() => setShowModal(true)}
          >
            Saber Más
          </Button>

          

          
        </Card.Body>
      </Card>

      {/* Modal para "Saber Más" */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-gray-700">
          <Modal.Title>Detalles del Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-800 text-white">
          {/* Carrusel de Imágenes en el Modal */}
          <Carousel variant="dark" className="mb-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <Carousel.Item key={image.id}>
                  <img
                    src={image.url}
                    className="d-block w-100"
                    alt={product.name}
                    style={{ height: '300px', objectFit: 'contain' }}
                  />
                </Carousel.Item>
              ))
            ) : (
              <Carousel.Item>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px', backgroundColor: '#4a4a4a' }}>
                  <span className="text-gray-400">No hay imágenes disponibles</span>
                </div>
              </Carousel.Item>
            )}
          </Carousel>

          {/* Descripción del Producto */}
          <h5 className="mb-2">Descripción</h5>
          <p>{product.description}</p>
        </Modal.Body>
        <Modal.Footer className="bg-gray-700">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

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
    </>
  );
}
