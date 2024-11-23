import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function Carousel() {
  const settings = {
    dots: true, // Mostrar indicadores de los slides
    infinite: true, // Deslizar infinitamente
    speed: 500, // Velocidad de la transición
    slidesToShow: 1, // Mostrar un slide a la vez
    slidesToScroll: 1, // Desplazarse un slide a la vez
    autoplay: true, // Auto-desplazamiento
    autoplaySpeed: 3000, // Tiempo entre cada desplazamiento (3 segundos)
    arrows: true, // Mostrar flechas de navegación
  };

  return (
    <div className="carousel-container w-full h-screen relative">
      <Slider {...settings}>
        {/* Slide 1 */}
        <div className="relative w-full h-screen">
          <img 
            src="https://steamuserimages-a.akamaihd.net/ugc/2363896044809467355/C449C0FE4E418DC854FF2CFD9CD7F70EE987FDBC/?imw=1920&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=fals" 
            alt="Imagen 1" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-white text-4xl font-bold">Descubre Figuras Exclusivas</h2>
          </div>
        </div>
        {/* Slide 2 */}
        <div className="relative w-full h-screen">
          <img 
            src="https://steamuserimages-a.akamaihd.net/ugc/2448361194626995472/DED866A9338FC3FF4B1BB6D20C5577E647B41FB2/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" 
            alt="Imagen 2" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-white text-4xl font-bold">Nuevas Figuras de tu Anime Favorito</h2>
          </div>
        </div>
        {/* Slide 3 */}
        <div className="relative w-full h-screen">
          <img 
            src="https://steamuserimages-a.akamaihd.net/ugc/2484383651244603114/571E2C617EED034DDA4A170808F96F98B0B86972/?imw=1920&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" 
            alt="Imagen 3" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-white text-4xl font-bold">Colecciona las Mejores Figuras con Nosotros</h2>
          </div>
        </div>
      </Slider>
    </div>
  );
}
