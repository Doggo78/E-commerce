// app/api/auth/login/route.js

import prisma from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../../utils/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 400 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 400 })
    }

    const token = generateToken(user)

    const response = NextResponse.json({ message: 'Inicio de sesión exitoso', user: { id: user.id, name: user.name, role: user.role } })
    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`)
    return response
  } catch (error) {
    console.error('Error en el login:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
