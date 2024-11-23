// app/pages/index.js

import { useEffect, useState } from 'react'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <div>
      <h1>Productos</h1>
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <img src={product.imageUrl} alt={product.name} width="200" />
            <button onClick={() => addToCart(product)}>Añadir al Carrito</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || []
  cart.push(product)
  localStorage.setItem('cart', JSON.stringify(cart))
  alert('Producto añadido al carrito')
}
