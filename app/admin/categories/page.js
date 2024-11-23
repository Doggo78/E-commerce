// app/admin/categories/page.js

'use client'

import { useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation' // Importa useRouter correctamente
import { AuthContext } from '../../utils/authContext' // Ruta corregida
import Link from 'next/link'
import CategoryList from './CategoryList' // Verifica que la ruta sea correcta

export default function CategoriesPage() {
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
  }, [user, loading, router])

  if (loading || !user || user.role !== 'ADMIN') {
    return <p>Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-lg p-8">
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-8">
          Gestión de Categorías
        </h1>

        <div className="flex justify-end mb-4">
          <Link href="/admin/categories/add">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300">
              Agregar Categoría
            </button>
          </Link>
        </div>

       

        <CategoryList />
      </div>
    </div>
  )
}
