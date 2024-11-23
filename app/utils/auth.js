// app/utils/auth.js

import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta' // Asegúrate de definir JWT_SECRET en .env

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY)
  } catch (e) {
    return null
  }
}
