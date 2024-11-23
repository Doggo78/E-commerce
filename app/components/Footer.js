export default function Footer() {
    return (
      <footer className="bg-[#303030] text-white py-6 w-full">
        <div className="container mx-auto px-4">
          <div className="row">
            <div className="col-12 col-md-4 mb-4 md:mb-0">
              <h4 className="text-xl font-bold">Enlaces Rápidos</h4>
              <ul className="list-none mt-4 space-y-2">
                <li><a href="/" className="hover:underline">Inicio</a></li>
                <li><a href="/productos" className="hover:underline">Productos</a></li>
                <li><a href="/sobre-nosotros" className="hover:underline">Sobre Nosotros</a></li>
                <li><a href="/contacto" className="hover:underline">Contacto</a></li>
              </ul>
            </div>
            <div className="col-12 col-md-4 mb-4 md:mb-0">
              <h4 className="text-xl font-bold">Contáctanos</h4>
              <ul className="list-none mt-4 space-y-2">
                <li>Email: contacto@animestore.com</li>
                <li>Teléfono: +12 345 6789</li>
                <li>Dirección: Calle Falsa 123, Ciudad Anime</li>
              </ul>
            </div>
            <div className="col-12 col-md-4">
              <h4 className="text-xl font-bold">Síguenos</h4>
              <ul className="list-none mt-4 space-y-2">
                <li><a href="https://facebook.com" className="hover:underline">Facebook</a></li>
                <li><a href="https://twitter.com" className="hover:underline">Twitter</a></li>
                <li><a href="https://instagram.com" className="hover:underline">Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center mt-6 border-t border-gray-700 pt-4">
          &copy; 2024 AnimeStore. Todos los derechos reservados.
        </div>
      </footer>
    );
  }
  