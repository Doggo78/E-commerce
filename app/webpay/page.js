// app/webpay/page.js

'use client'

import { useEffect } from 'react'

export default function Webpay() {
  useEffect(() => {
    // Aquí puedes integrar la lógica de Webpay o simular el pago
    // Por ahora, simplemente mostramos un mensaje
    alert('Redirigiendo a la simulación de pago de Webpay...')
    // Simulación de redirección
    window.location.href = 'https://www.google.com' // Cambia esto a la URL de Webpay de prueba
  }, [])

  return (
    <div>
      <h1>Procesando Pago...</h1>
    </div>
  )
}
