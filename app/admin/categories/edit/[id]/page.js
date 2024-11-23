// app/admin/categories/edit/[id]/page.js

'use client'

import { useEffect, useState, useContext } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AuthContext } from '../../../../utils/authContext'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default function EditCategoryPage() {
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (user.role !== 'ADMIN') {
        router.push('/')
      } else {
        // Obtener la categoría actual
        const fetchCategory = async () => {
          try {
            const res = await fetch(`/api/categories/${id}`)
            if (res.ok) {
              const data = await res.json()
              setName(data.name)
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
    }
  }, [user, loading, router, id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (name.trim() === '') {
      setError('El nombre de la categoría no puede estar vacío.')
      setSuccess('')
      return
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const data = await res.json()

      if (res.ok) {
        Swal.fire(
          'Éxito',
          'Categoría actualizada exitosamente.',
          'success'
        )
        setSuccess('Categoría actualizada exitosamente.')
        setError('')
        router.push('/admin/categories')
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
      console.error('Error al actualizar la categoría:', error)
      Swal.fire(
        'Error',
        'Error en el servidor.',
        'error'
      )
      setError('Error en el servidor.')
      setSuccess('')
    }
  }

  if (loading) {
    return <p>Cargando...</p>
  }

  if (!user || user.role !== 'ADMIN') {
    return <p>No autorizado</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Editar Categoría
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition duration-300 font-semibold"
          >
            Actualizar Categoría
          </button>
          {success && <p className="text-green-600 text-center font-semibold">{success}</p>}
          {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
        </form>
      </div>
    </div>
  )
}
