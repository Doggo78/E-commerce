// app/components/RecommendedProducts.js

'use client'

import { useEffect, useState } from 'react'
import ProductItem from './ProductItem'

export default function RecommendedProducts() {
  const [recommendedProducts, setRecommendedProducts] = useState([])

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch('/api/recommendations')
        if (!res.ok) {
          throw new Error('Error al obtener recomendaciones')
        }
        const data = await res.json()
        console.log('Recomendaciones recibidas:', data) // Verifica la estructura de los datos
        setRecommendedProducts(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchRecommendations()
  }, [])

  return (
    <div>
      <h1>Productos Recomendados</h1>
      <div className="recommended-product-list">
        {recommendedProducts.length > 0 ? (
          recommendedProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))
        ) : (
          <p>No hay productos recomendados aún.</p>
        )}
      </div>
    </div>
  )
}
