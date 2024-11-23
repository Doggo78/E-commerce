// app/api/auth/register/route.js

import prisma from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CLIENT',
      },
    })

    return NextResponse.json({ message: 'Usuario registrado exitosamente' }, { status: 201 })
  } catch (error) {
    console.error('Error en el registro:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
