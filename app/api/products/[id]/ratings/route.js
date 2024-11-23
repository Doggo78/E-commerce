// api/products/[id]/ratings/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyToken } from '../../../../utils/auth';

export async function POST(request, { params }) {
  const { id } = params;
  const token = request.cookies.get('token')?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { stars } = await request.json();

    if (typeof stars !== 'number' || stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'Calificación inválida' }, { status: 400 });
    }

    // Verificar si el usuario ya ha calificado el producto
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: parseInt(id, 10),
        },
      },
    });

    if (existingRating) {
      // Actualizar la calificación existente
      await prisma.rating.update({
        where: {
          userId_productId: {
            userId: user.id,
            productId: parseInt(id, 10),
          },
        },
        data: {
          stars,
        },
      });
    } else {
      // Crear una nueva calificación
      await prisma.rating.create({
        data: {
          userId: user.id,
          productId: parseInt(id, 10),
          stars,
        },
      });
    }

    // Calcular la nueva puntuación promedio
    const ratings = await prisma.rating.findMany({
      where: { productId: parseInt(id, 10) },
    });

    const total = ratings.reduce((acc, rating) => acc + rating.stars, 0);
    const avg = (total / ratings.length).toFixed(1);

    return NextResponse.json({ newAverageRating: avg });
  } catch (error) {
    console.error('Error al calificar el producto:', error);
    return NextResponse.json({ error: 'Error al calificar el producto' }, { status: 500 });
  }
}
