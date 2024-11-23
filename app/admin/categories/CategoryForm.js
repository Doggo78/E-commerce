// app/admin/categories/CategoryForm.js

'use client'

import { useState, useContext, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AuthContext } from '../../utils/authContext'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default function CategoryForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categories, setCategories] = useState([]) // Estado para las categorías existentes
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()
  const params = useParams()

  const categoryId = params.id || null // Obtener el ID de la categoría si está en la ruta

  useEffect(() => {
    if (!loading) {
      // Redirigir si no está autenticado o no es admin
      if (!user) {
        router.push('/login')
      } else if (user.role !== 'ADMIN') {
        router.push('/')
      }
    }

    // Cargar las categorías desde la API
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

    // Si está en modo de edición, cargar los datos de la categoría
    if (categoryId) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(`/api/categories/${categoryId}`)
          if (res.ok) {
            const data = await res.json()
            setCategoryName(data.name)
          } else {
            setError('Categoría no encontrada')
          }
        } catch (error) {
          console.error('Error al cargar la categoría:', error)
          setError('Error al cargar la categoría')
        }
      }

      fetchCategory()
    }
  }, [user, loading, router, categoryId])

  // Manejar el envío de categoría (Agregar o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (categoryName.trim() === '') {
      setError('El nombre de la categoría no puede estar vacío.')
      setSuccess('')
      return
    }

    try {
      const res = await fetch(categoryId ? `/api/categories/${categoryId}` : '/api/categories', {
        method: categoryId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(categoryId ? 'Categoría actualizada exitosamente' : 'Categoría agregada exitosamente')
        setError('')
        if (!categoryId) {
          e.target.reset()
        }
        // Actualizar la lista de categorías
        fetchCategories()
      } else {
        setError(data.error)
        setSuccess('')
      }
    } catch (error) {
      console.error('Error al enviar categoría:', error)
      setError('Error en el servidor')
    }
  }

  // Función para volver a cargar las categorías
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

  // Manejar la eliminación de categoría
  const handleDelete = async (id) => {
    // Usar SweetAlert2 para confirmación
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
          fetchCategories()
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

  // Manejar la edición de categoría desde la tabla
  const handleEdit = (id) => {
    router.push(`/admin/categories/edit/${id}`)
  }

  if (loading) {
    return <p>Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8">
        {/* Sección de Agregar/Editar Categoría */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {categoryId ? 'Editar Categoría' : 'Agregar Categoría'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="categoryName"
              type="text"
              placeholder="Nombre de la categoría"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-lg w-full hover:bg-green-600 transition duration-300 font-semibold"
            >
              {categoryId ? 'Actualizar Categoría' : 'Agregar Categoría'}
            </button>
            {success && <p className="text-green-600 text-center font-semibold">{success}</p>}
            {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
          </form>
        </div>

        {/* Sección de Tabla de Categorías Existentes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Categorías Existentes
          </h2>
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
      </div>
    </div>
  )
}
