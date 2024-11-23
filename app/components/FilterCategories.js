import { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import ProductList from './ProductList';

export default function HomePage({ products }) {
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filtrar productos por categoría
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category.name === selectedCategory)
    : products;

  return (
    <div className="flex">
      <CategoryFilter setSelectedCategory={setSelectedCategory} />
      <ProductList products={filteredProducts} />
    </div>
  );
}
