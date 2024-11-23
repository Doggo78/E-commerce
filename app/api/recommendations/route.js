// app/api/recommendations/route.js

import prisma from '../../../lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '../../utils/auth'

export async function GET(request) {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  const user = verifyToken(token)

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    // Obtener las categorías de los productos que el usuario ha puntuado con 4 o más estrellas
    const highRatedCategories = await prisma.rating.findMany({
      where: {
        userId: user.id,
        stars: {
          gte: 4, // Puntuaciones de 4 o más
        },
      },
      select: {
        product: {
          select: {
            categoryId: true, // Solo nos interesa la categoría de los productos
          },
        },
      },
    })

    const categoryIds = [...new Set(highRatedCategories.map(rating => rating.product.categoryId))]

    if (categoryIds.length === 0) {
      return NextResponse.json([], { status: 200 }) // No hay categorías con puntuaciones altas
    }

    // Obtener productos de esas categorías, excluyendo productos que ya haya puntuado
    const recommendedProducts = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryIds, // Filtrar por categorías relacionadas
        },
        ratings: {
          none: {
            userId: user.id, // Excluir productos ya puntuados por el usuario
          },
        },
      },
      include: {
        ratings: true,
        images: true,
        category: true,
      },
    })

    return NextResponse.json(recommendedProducts, { status: 200 })
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error)
    return NextResponse.json({ error: 'Error al obtener recomendaciones' }, { status: 500 })
  }
}
