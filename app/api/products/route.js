// app/api/products/route.js

import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export async function GET(request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
        likes: true,
        ratings: true,
      },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request) {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  const user = verifyToken(token)

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { name, description, price, stock, categoryId, imageUrls } = await request.json()

    // Verificar que las URLs de imágenes sean un array y tengan 5 imágenes
    if (!Array.isArray(imageUrls) || imageUrls.length !== 5) {
      return NextResponse.json({ error: 'Debes proporcionar exactamente 5 imágenes' }, { status: 400 })
    }

    // Crear el producto con la categoría seleccionada
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category: { connect: { id: parseInt(categoryId, 10) } },  // Conectar con la categoría
      },
    })

    // Crear las imágenes relacionadas con el producto
    const imagesData = imageUrls.map((url) => ({
      url,
      productId: product.id,
    }))

    await prisma.image.createMany({
      data: imagesData,
    })

    // Incluir las imágenes y categoría en la respuesta
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true, category: true },
    })

    return NextResponse.json(productWithImages, { status: 201 })
  } catch (error) {
    console.error('Error al crear producto:', error)
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
