// app/components/CategoryList.js

'use client'

import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../utils/authContext'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (user.role !== 'ADMIN') {
        router.push('/')
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        } else {
          setError('Error al cargar categorías')
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error)
        setError('Error al cargar categorías')
      }
    }

    fetchCategories()
  }, [user, loading, router])

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará la categoría y puede afectar a los productos relacionados.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        })

        const data = await res.json()

        if (res.ok) {
          Swal.fire(
            'Eliminado',
            'La categoría ha sido eliminada exitosamente.',
            'success'
          )
          setSuccess('Categoría eliminada exitosamente')
          setError('')
          // Actualizar la lista de categorías
          setCategories(categories.filter(category => category.id !== id))
        } else {
          Swal.fire(
            'Error',
            data.error,
            'error'
          )
          setError(data.error)
          setSuccess('')
        }
      } catch (error) {
        console.error('Error al eliminar la categoría:', error)
        Swal.fire(
          'Error',
          'Error en el servidor',
          'error'
        )
        setError('Error en el servidor')
      }
    }
  }

  const handleEdit = (id) => {
    router.push(`/admin/categories/edit/${id}`)
  }

  if (loading) {
    return <p>Cargando...</p>
  }

  return (
    <div>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {success && <p className="text-green-600 text-center mb-4">{success}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-black">ID</th>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="text-center">
                  <td className="py-2 px-4 border-b">{category.id}</td>
                  <td className="py-2 px-4 border-b">{category.name}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center">
                  No hay categorías disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
