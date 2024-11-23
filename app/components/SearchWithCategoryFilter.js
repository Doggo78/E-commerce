import { useState, useEffect } from 'react';
import CategoryFilter from './CategoryFilter'; // Componente del filtro de categorías

export default function SearchWithCategoryFilter() {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el término de búsqueda
  const [selectedCategory, setSelectedCategory] = useState(''); // Estado para la categoría seleccionada
  const [results, setResults] = useState([]); // Estado para los resultados de búsqueda
  const [loading, setLoading] = useState(false); // Estado para el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para manejar la búsqueda y el filtrado
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Limpiamos errores previos

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}`);

      if (!res.ok) {
        throw new Error('Error al buscar productos');
      }

      const data = await res.json();
      setResults(data); // Guardamos los resultados
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center my-4">Buscar Productos</h1>

      {/* Buscador */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="w-full flex justify-center">
          <input
            type="text"
            placeholder="Buscar productos por nombre o descripción"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl p-2 border border-gray-400 rounded-lg mr-2"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Buscar
          </button>
        </form>
        {loading && <p className="text-center mt-4">Buscando...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>

      <div className="md:flex md:space-x-6">
        {/* Filtro de Categorías */}
        <CategoryFilter setSelectedCategory={setSelectedCategory} />

        {/* Resultados filtrados */}
        <div className="md:w-3/4 w-full p-4">
          <h2 className="text-2xl font-bold mb-4">Productos Encontrados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.length > 0 ? (
              results.map((product) => (
                <div key={product.id} className="card shadow-sm mb-4 p-4 bg-gray-800 text-white rounded-lg">
                  <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-400">{product.category}</p>
                  <p>{product.description}</p>
                  <p className="text-yellow-500 font-bold">${product.price}</p>
                </div>
              ))
            ) : (
              !loading && <p className="text-center col-span-3 text-gray-500">No se encontraron productos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
