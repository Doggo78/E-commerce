// api/products/[id]/likes/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyToken } from '../../../../utils/auth';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const totalLikes = await prisma.like.count({
      where: { productId: parseInt(id, 10) },
    });

    // Obtener el estado de like del usuario actual
    const token = request.cookies.get('token')?.value;
    const user = verifyToken(token);

    let userHasLiked = false;
    if (user) {
      const like = await prisma.like.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId: parseInt(id, 10),
          },
        },
      });
      userHasLiked = !!like;
    }

    return NextResponse.json({ totalLikes, userHasLiked });
  } catch (error) {
    console.error('Error al obtener likes:', error);
    return NextResponse.json({ error: 'Error al obtener likes' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  const token = request.cookies.get('token')?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // Verificar si el usuario ya ha dado like
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: parseInt(id, 10),
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: 'Ya has dado like a este producto' }, { status: 400 });
    }

    // Crear el like
    await prisma.like.create({
      data: {
        userId: user.id,
        productId: parseInt(id, 10),
      },
    });

    const totalLikes = await prisma.like.count({
      where: { productId: parseInt(id, 10) },
    });

    return NextResponse.json({ totalLikes, userHasLiked: true });
  } catch (error) {
    console.error('Error al dar like:', error);
    return NextResponse.json({ error: 'Error al dar like' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const token = request.cookies.get('token')?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // Verificar si el like existe
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: parseInt(id, 10),
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json({ error: 'No has dado like a este producto' }, { status: 400 });
    }

    // Eliminar el like
    await prisma.like.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: parseInt(id, 10),
        },
      },
    });

    const totalLikes = await prisma.like.count({
      where: { productId: parseInt(id, 10) },
    });

    return NextResponse.json({ totalLikes, userHasLiked: false });
  } catch (error) {
    console.error('Error al eliminar like:', error);
    return NextResponse.json({ error: 'Error al eliminar like' }, { status: 500 });
  }
}
