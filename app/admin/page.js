// app/admin/page.js

'use client'

import { useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../utils/authContext'
import Link from 'next/link'

export default function AdminDashboard() {
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Redirigir si no está autenticado o no es admin
      if (!user) {
        router.push('/login')
      } else if (user.role !== 'ADMIN') {
        router.push('/')
      }
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== 'ADMIN') {
    return <p>Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8">
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-8">
          Panel de Administración
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
          {/* Botón de agregar producto */}
          

          {/* Texto de recomendación para el administrador */}
          <p className="text-gray-600 text-center md:text-left text-lg">
            Mantén actualizada la lista de productos y revisa las solicitudes de los
            clientes regularmente para asegurar una excelente experiencia de compra.
          </p>
        </div>

        {/* Sección para gestionar productos y categorías */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Gestión de Productos */}
          <Link href="/admin/products/add" className="flex-1 bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">Gestionar Productos</h2>
            <p className="text-gray-700">Añadir, editar y eliminar productos existentes.</p>
          </Link>

          {/* Gestión de Categorías */}
          <Link href="/admin/categories" className="flex-1 bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition duration-300 text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Gestionar Categorías</h2>
            <p className="text-gray-700">Añadir, editar y eliminar categorías de productos.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
