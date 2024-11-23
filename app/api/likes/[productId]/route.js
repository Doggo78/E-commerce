// app/components/ProductItem.js

'use client';

import Slider from "react-slick";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../utils/authContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function ProductItem({ product }) {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isLoadingLikes, setIsLoadingLikes] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  if (!product || !product.name) {
    return <p className="text-center text-gray-500">Cargando producto...</p>;
  }

  useEffect(() => {
    if (product.ratings && product.ratings.length > 0) {
      const total = product.ratings.reduce((acc, rating) => acc + rating.stars, 0);
      const avg = (total / product.ratings.length).toFixed(1);
      setAverageRating(avg);
    } else {
      setAverageRating('No hay puntuaciones');
    }
  }, [product.ratings]);

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

  const handleLikeToggle = async () => {
    if (!user) {
      alert('Debes iniciar sesión para dar "like" a un producto.');
      return;
    }

    try {
      const res = await fetch(`/api/likes/${product.id}`, {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      alert(error.message);
    }
  };

  const handleRatingSubmit = async (newRating) => {
    try {
      const res = await fetch(`/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          stars: newRating,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al enviar la puntuación');
      }

      const data = await res.json();
      setRating(data.stars);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const calculateRatingDistribution = () => {
    if (!product.ratings || product.ratings.length === 0) return {};

    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = 0;
    }

    product.ratings.forEach(rating => {
      distribution[rating.stars] += 1;
    });

    for (let i = 1; i <= 5; i++) {
      distribution[i] = ((distribution[i] / product.ratings.length) * 100).toFixed(1);
    }

    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution();

  return (
    <div className="product-item border border-gray-200 rounded-lg p-4 m-4 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>

      {/* Carrusel de imágenes */}
      <Slider {...settings} className="mb-4">
        {product.images && product.images.length > 0 ? (
          product.images.map((image) => (
            <div key={image.id}>
              <img
                src={image.url}
                alt={product.name}
                className="w-full h-auto object-cover rounded"
              />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No hay imágenes disponibles</div>
        )}
      </Slider>

      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-xl font-bold mb-2">Precio: ${product.price}</p>
      <p className="mb-4">Puntuación promedio: {averageRating} ⭐</p>

      {/* Sistema de puntuación */}
      <div className="rating-system mb-4">
        <h3 className="text-lg font-medium mb-2">Califica este producto:</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="text-yellow-500 text-2xl focus:outline-none hover:text-yellow-600 transition-colors"
              onClick={() => handleRatingSubmit(star)}
              aria-label={`Calificar con ${star} estrellas`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

    

      {/* Mostrar distribución de calificaciones para usuarios no autenticados */}
      {!user && product.ratings && product.ratings.length > 0 && (
        <div className="rating-distribution">
          <h3 className="text-lg font-medium mb-2">Distribución de Calificaciones:</h3>
          {Object.keys(ratingDistribution).map((star) => (
            <div key={star} className="flex items-center mb-1">
              <span className="w-16">{star} ⭐</span>
              <div className="w-full bg-gray-300 h-2 rounded mr-2">
                <div
                  className="bg-yellow-500 h-2 rounded"
                  style={{ width: `${ratingDistribution[star]}%` }}
                ></div>
              </div>
              <span className="w-16 text-right">{ratingDistribution[star]}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
