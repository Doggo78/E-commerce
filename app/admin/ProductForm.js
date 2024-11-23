// app/admin/products/ProductForm.js

'use client'

import { useState, useContext, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AuthContext } from '../utils/authContext'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { FaEdit, FaTrash } from 'react-icons/fa';
import AddCategoryPage from './categories/add/page'

export default function ProductForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageUrls, setImageUrls] = useState(['', '', '', '', '']) // Estado para las 5 imágenes
  const [categories, setCategories] = useState([]) // Estado para las categorías
  const [selectedCategory, setSelectedCategory] = useState('') // Categoría seleccionada
  const [products, setProducts] = useState([]) // Estado para los productos existentes
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()
  const params = useParams()

  const productId = params.id || null // Obtener el ID del producto si está en la ruta

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

    // Cargar los productos existentes
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        } else {
          setError('Error al cargar productos')
        }
      } catch (error) {
        console.error('Error al cargar productos:', error)
        setError('Error al cargar productos')
      }
    }

    fetchCategories()
    fetchProducts()

    // Si está en modo de edición, cargar los datos del producto
    if (productId) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${productId}`)
          if (res.ok) {
            const data = await res.json()
            // Prellenar el formulario con los datos del producto
            document.getElementsByName('name')[0].value = data.name
            document.getElementsByName('description')[0].value = data.description
            document.getElementsByName('price')[0].value = data.price
            document.getElementsByName('stock')[0].value = data.stock
            setSelectedCategory(data.categoryId)

            // Prellenar las URLs de las imágenes
            const urls = data.images.slice(0, 5).map(img => img.url)
            while (urls.length < 5) {
              urls.push('')
            }
            setImageUrls(urls)
          } else {
            setError('Producto no encontrado')
          }
        } catch (error) {
          console.error('Error al cargar el producto:', error)
          setError('Error al cargar el producto')
        }
      }

      fetchProduct()
    }
  }, [user, loading, router, productId])

  // Actualizar el valor de las imágenes
  const handleImageChange = (index, value) => {
    const updatedUrls = [...imageUrls]
    updatedUrls[index] = value
    setImageUrls(updatedUrls)
  }

  // Manejar el envío de producto (Agregar o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, description, price, stock } = e.target.elements

    // Validaciones adicionales
    if (parseFloat(price.value) < 0) {
      setError('El precio debe ser un número positivo.')
      setSuccess('')
      return
    }

    if (parseInt(stock.value, 10) < 0) {
      setError('El stock debe ser un número positivo.')
      setSuccess('')
      return
    }

    try {
      const res = await fetch(productId ? `/api/products/${productId}` : '/api/products', {
        method: productId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value,
          description: description.value,
          price: parseFloat(price.value),
          stock: parseInt(stock.value, 10),
          categoryId: selectedCategory,
          imageUrls: imageUrls,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(productId ? 'Producto actualizado exitosamente' : 'Producto agregado exitosamente')
        setError('')
        if (!productId) {
          e.target.reset()
          setImageUrls(['', '', '', '', ''])
          setSelectedCategory('')
        }
        // Actualizar la lista de productos
        fetchProducts()
      } else {
        setError(data.error)
        setSuccess('')
      }
    } catch (error) {
      console.error('Error al enviar producto:', error)
      setError('Error en el servidor')
    }
  }

  // Función para volver a cargar los productos
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      } else {
        setError('Error al cargar productos')
      }
    } catch (error) {
      console.error('Error al cargar productos:', error)
      setError('Error al cargar productos')
    }
  }

  // Manejar la creación de una nueva categoría (ya no es necesario aquí)
  // Eliminamos esta sección y la gestionamos por separado

  // Manejar la eliminación de producto
  const handleDelete = async (id) => {
    // Usar SweetAlert2 para confirmación más estilizada (opcional)
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })

        const data = await res.json()

        if (res.ok) {
          Swal.fire(
            'Eliminado',
            'El producto ha sido eliminado exitosamente.',
            'success'
          )
          setSuccess('Producto eliminado exitosamente')
          setError('')
          // Actualizar la lista de productos
          fetchProducts()
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
        console.error('Error al eliminar el producto:', error)
        Swal.fire(
          'Error',
          'Error en el servidor',
          'error'
        )
        setError('Error en el servidor')
      }
    }
  }

  // Manejar la edición de producto desde la tabla
  const handleEdit = (id) => {
    router.push(`/admin/products/edit/${id}`)
  }

  if (loading) {
    return <p>Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="bg-white w-full  rounded-lg shadow-lg p-8">
      <AddCategoryPage />
        {/* Sección de Agregar/Editar Producto */}
        <div className="max-w-4xl mx-auto py-6 bg-white shadow-md rounded-lg">

  <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
    {productId ? 'Editar Producto' : 'Agregar Producto'}
  </h1>
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      name="name"
      type="text"
      placeholder="Nombre del producto"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
    />
    <input
      name="description"
      type="text"
      placeholder="Descripción"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
    />
    <input
      name="price"
      type="number"
      step="0.01"
      placeholder="Precio"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
    />
    <input
      name="stock"
      type="number"
      placeholder="Stock"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
    />

    {imageUrls.map((url, index) => (
      <input
        key={index}
        type="text"
        placeholder={`URL de la imagen ${index + 1}`}
        value={url}
        onChange={(e) => handleImageChange(index, e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
      />
    ))}

    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
    >
      <option value="">Selecciona una categoría</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>

    {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
    {success && <p className="text-green-600 text-center font-semibold">{success}</p>}

    <button
      type="submit"
      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg w-full hover:shadow-lg hover:scale-105 transition duration-300 font-semibold"
    >
      {productId ? 'Actualizar Producto' : 'Agregar Producto'}
    </button>
  </form>

  {/* Botón de Eliminar Producto (solo en modo edición) */}
  {productId && (
    <div className="mt-6">
      <button
        onClick={() => handleDelete(productId)}
        className="bg-red-500 text-white px-6 py-3 rounded-lg w-full hover:bg-red-600 transition duration-300 font-semibold"
      >
        Eliminar Producto
      </button>
    </div>
  )}
</div>


        {/* Sección de Tabla de Productos Existentes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Productos Existentes
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-black">ID</th>
                  <th className="py-2 px-4 border-b text-black">Nombre</th>
                  <th className="py-2 px-4 border-b text-black">Descripción</th>
                  <th className="py-2 px-4 border-b text-black">Precio</th>
                  <th className="py-2 px-4 border-b text-black">Stock</th>
                  <th className="py-2 px-4 border-b text-black">Categoría</th>
                  <th className="py-2 px-4 border-b text-black">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="text-center">
                      <td className="py-2 px-4 border-b text-black text-black">{product.id}</td>
                      <td className="py-2 px-4 border-b text-black text-black ">{product.name}</td>
                      <td className="py-2 px-4 border-b text-black text-black">{product.description}</td>
                      <td className="py-2 px-4 border-b text-black">${product.price.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b text-black">{product.stock}</td>
                      <td className="py-2 px-4 border-b text-black">{product.category.name}</td>
                      <td className="py-2 px-4 border-b text-black space-x-2">
    
<div className="flex flex-col items-center space-y-2 w-32"> {/* Establece un ancho fijo para el contenedor */}
  <button
    onClick={() => handleEdit(product.id)}
    className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 transform hover:scale-105 space-x-2"
  >
    <FaEdit className="text-white" />
    <span>Editar</span>
  </button>

  <button
    onClick={() => handleDelete(product.id)}
    className="flex items-center justify-center w-full bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200 transform hover:scale-105 space-x-2"
  >
    <FaTrash className="text-white" />
    <span>Eliminar</span>
  </button>
</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center">
                      No hay productos disponibles.
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
