// app/api/ratings/route.js

import prisma from '../../../lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '../../utils/auth'

export async function POST(request) {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  const user = verifyToken(token)

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { productId, stars } = await request.json()

    // Verificar que la puntuación esté entre 1 y 5
    if (stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'La puntuación debe estar entre 1 y 5 estrellas' }, { status: 400 })
    }

    // Crear o actualizar la puntuación del usuario para este producto
    const rating = await prisma.rating.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: parseInt(productId),
        },
      },
      update: {
        stars,
      },
      create: {
        userId: user.id,
        productId: parseInt(productId),
        stars,
      },
    })

    return NextResponse.json(rating, { status: 201 })
  } catch (error) {
    console.error('Error al añadir puntuación:', error)
    return NextResponse.json({ error: 'Error al añadir puntuación' }, { status: 500 })
  }
}
