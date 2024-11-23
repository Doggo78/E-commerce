// app/card-productos/page.js

'use client';

import { useState, useEffect } from 'react';
import CardProduct from '../../components/CardProduct';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function CardProductosPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          setError('Error al cargar productos');
          Swal.fire('Error', 'Hubo un error al cargar los productos.', 'error');
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setError('Error al cargar productos');
        Swal.fire('Error', 'Hubo un error al cargar los productos.', 'error');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Nuestros Productos</h1>
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="row">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="col-md-4">
              <CardProduct product={product} />
            </div>
          ))
        ) : (
          <p className="text-center">Cargando productos...</p>
        )}
      </div>
    </div>
  );
}
