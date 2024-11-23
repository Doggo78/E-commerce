// app/layout.js

import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from './components/Navbar';
import { AuthProvider } from './utils/authContext';

export const metadata = {
  title: 'Tu Tienda',
  description: 'Tienda virtual con productos recomendados',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
