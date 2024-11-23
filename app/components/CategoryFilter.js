import { useState, useEffect } from 'react';

export default function CategoryFilter({ setSelectedCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category-filter bg-[#303030] text-white p-4 shadow-lg  p-6 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-400 pb-2">Categorías</h2>
      <ul className="space-y-3">
        <li>
          <button
            className="w-full text-left px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg"
            onClick={() => setSelectedCategory('')}
          >
            Todas las Categorías
          </button>
        </li>
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <li key={index}>
              <button
                className="w-full text-left px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            </li>
          ))
        ) : (
          <li className="text-yellow-400">Cargando categorías...</li>
        )}
      </ul>
    </div>
  );
}
