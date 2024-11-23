// app/admin/categories/add/page.js

'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../utils/authContext';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function AddCategoryPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <p>No autorizado</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === '') {
      setError('El nombre de la categoría no puede estar vacío.');
      setSuccess('');
      return;
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Éxito', 'Categoría agregada exitosamente.', 'success');
        setSuccess('Categoría agregada exitosamente.');
        setError('');
        setName('');
        router.push('/admin/categories');
      } else {
        Swal.fire('Error', data.error, 'error');
        setError(data.error);
        setSuccess('');
      }
    } catch (error) {
      console.error('Error al agregar la categoría:', error);
      Swal.fire('Error', 'Error en el servidor.', 'error');
      setError('Error en el servidor.');
      setSuccess('');
    }
  };

  return (
    <div className="flex justify-center items-center  bg-gray-100 px-4 py-5">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Agregar Categoría
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Agregar Categoría
          </button>
        </form>
      </div>
    </div>
  );
}
