'use client';

import { useEffect, useState } from 'react';
import ProductItem from './components/ProductItem';
import CategoryFilter from './components/CategoryFilter';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot'
import CarouselPortada from './components/CarouselPortada';
import ContactForm from './components/ContactForm'

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data); // Inicialmente mostrar todos los productos
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, []);

  // Filtrar productos por categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter(
        (product) => product.category.name === selectedCategory
      );
      setFilteredProducts(filtered);
      setCurrentPage(1); // Volver a la primera página al cambiar la categoría
    } else {
      setFilteredProducts(products); // Mostrar todos los productos si no hay categoría seleccionada
      setCurrentPage(1); // Volver a la primera página si no hay filtro
    }
  }, [selectedCategory, products]);

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="">
      <div>
        <CarouselPortada/>
      </div>
      {/* Carrusel ajustado */}
      <div className="w-full max-w-5xl mx-auto my-8">
      <div className="container my-8">
  <div className="row align-items-center">
    {/* Título principal */}
    <div className="col-12 text-center mb-4">
      <h2 className="text-4xl font-bold">AnimeStore</h2>
    </div>

    {/* Sección de texto de "Quiénes Somos" */}

  </div>
</div>

        
      </div>  

      {/* Fila principal que contiene el filtro de categorías y los productos */}
      <div className='container'>
      <div className="row">
        {/* Filtro de categorías */}
        <div className="col-12 col-md-3 mb-4 order-md-1 order-1">
          <CategoryFilter setSelectedCategory={setSelectedCategory} />
        </div>

        {/* Contenedor de productos */}
        <div className="col-12 col-md-9 order-md-2 order-1">
          <h1 className="text-center text-3xl font-bold mb-6">Productos Disponibles</h1>
          <div className="row">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div className="col-12 col-sm-6 col-lg-4 mb-4" key={product.id}>
                  <ProductItem product={product} />
                </div>
              ))
            ) : (
              <p className="text-center col-12 text-gray-500">Cargando productos...</p>
            )}
          </div>
        </div>
      </div>

      </div>
      <div className='pt-5 pb-5'>
        {/* Paginación centrada */}
      {totalPages > 1 && (
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center">
            <div className="btn-group">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Sección de "Quiénes Somos" e imagen centradas antes del footer */}
<div className="container my-16">
  <div className="row align-items-center justify-content-center">
    {/* Sección de texto de "Quiénes Somos" */}
    <div className="col-lg-6 col-md-12 mb-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Quiénes Somos</h2>
        <p className="text-gray-300 leading-7">
          Bienvenidos a <span className="font-bold text-yellow-300">AnimeStore</span>, tu tienda especializada en figuras y coleccionables de anime. 
          Nuestra tienda nació hace más de 5 años con la pasión de ofrecer productos de calidad para los fanáticos del anime.
          Comenzamos como un pequeño grupo de amigos que compartían la misma afición, y poco a poco nos expandimos para ofrecer 
          una amplia variedad de figuras, estatuas, y mercancías exclusivas. Nos enorgullecemos de traer a nuestros clientes 
          las mejores piezas de sus series y personajes favoritos, garantizando una experiencia de compra única y satisfactoria.
        </p>
        <p className="text-gray-300 leading-7 mt-4">
          Gracias por ser parte de nuestra comunidad de coleccionistas y entusiastas del anime. Estamos comprometidos a seguir creciendo
          y ofrecerte productos cada vez más sorprendentes. ¡Nos encanta ser parte de tu colección!
        </p>
      </div>
    </div>

    {/* Sección de imagen */}
    <div className="col-lg-6 col-md-12 mb-4">
      <div className="text-center">
        <img 
          src="https://www.roc21.com/wp-content/uploads/2021/06/figuras-Nendoroid-1.jpg" 
          alt="Anime Store" 
          className="img-fluid rounded shadow-lg" 
        />
      </div>
    </div>
  </div>
</div>
 <div className="w-full flex flex-col items-center justify-center my-8">
  <h2 className="text-yellow-300 text-2xl font-bold mb-4 text-center">Síguenos en YouTube</h2>
  <div className="flex justify-center">
    <iframe
      width="800"
      height="315"
      src="https://www.youtube.com/embed/7EOREeaIgGI?si=C-a1qQU40Zvj7z36"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      className="mx-auto"
    ></iframe>
  </div>
</div>

<div className="container my-8">
  <h2 className="text-center text-3xl font-bold mb-6 text-white">Encuéntranos en</h2>
  <div className="row align-items-center">
    {/* Mapa */}
    <div className="col-12 col-md-6 mb-4 mb-md-0 d-flex flex-column align-items-center">
      <h5 className="text-center text-lg font-semibold mb-2 text-white">Nuestra Ubicación</h5>
      <div className="w-100 bg-white shadow-lg rounded" style={{ overflow: 'hidden' }}>
        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=las%20condes%20+(Mi%20nombre%20de%20negocios)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        ></iframe>
      </div>
    </div>

    {/* Formulario de Contacto */}
    <div className="col-12 col-md-6 d-flex flex-column align-items-center">
      <h5 className="text-center text-lg font-semibold mb-2 text-white">Contacta con nosotros</h5>
      <div className="bg-light p-4 rounded shadow-lg w-100">
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-black">Nombre</label>
            <input type="text" className="form-control" id="name" placeholder="Nombre" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-black">Correo Electrónico</label>
            <input type="email" className="form-control" id="email" placeholder="Correo Electrónico" />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label text-black">Mensaje</label>
            <textarea className="form-control" id="message" rows="4" placeholder="Escribe tu mensaje aquí"></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100 ">Enviar</button>
        </form>
      </div>
    </div>
  </div>
</div>




      </div>
   
      
      <Footer />
      <ChatBot/>
    </div>
 
  );
}
