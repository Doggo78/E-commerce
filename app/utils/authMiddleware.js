// app/utils/authMiddleware.js

import { verifyToken } from './auth'

export function withAuth(handler) {
  return async (req, res) => {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const user = verifyToken(token)

    if (!user) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    req.user = user

    return handler(req, res)
  }
}
