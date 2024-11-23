// app/register/page.js

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password } = e.target.elements

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Usuario registrado exitosamente. Redirigiendo al login...')
        setError('')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.error)
        setSuccess('')
      }
    } catch (error) {
      console.error('Error en el registro:', error)
      setError('Error en el servidor')
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#212121' }}>
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">Registro</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <input 
          name="name" 
          type="text" 
          placeholder="Nombre" 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Correo electrónico" 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Contraseña" 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
  
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
  
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
  
}  