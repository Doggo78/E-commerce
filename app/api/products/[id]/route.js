// app/api/products/[id]/route.js

import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { verifyToken } from '../../../utils/auth'

export async function GET(request, { params }) {
  const { id } = params

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        images: true,
        ratings: true,
        likes: true,
        category: true,
        // Incluir otras relaciones si es necesario
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error al obtener el producto:', error)
    return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const { id } = params
  const token = request.cookies.get('token')?.value
  const user = verifyToken(token)

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { name, description, price, stock, categoryId, imageUrls } = await request.json()

    // Validaciones adicionales
    if (!Array.isArray(imageUrls) || imageUrls.length !== 5) {
      return NextResponse.json({ error: 'Debes proporcionar exactamente 5 imágenes' }, { status: 400 })
    }

    // Actualizar el producto
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        description,
        price,
        stock,
        category: { connect: { id: parseInt(categoryId, 10) } },
      },
    })

    // Eliminar imágenes existentes
    await prisma.image.deleteMany({
      where: { productId: updatedProduct.id },
    })

    // Crear nuevas imágenes
    const imagesData = imageUrls.map(url => ({
      url,
      productId: updatedProduct.id,
    }))

    await prisma.image.createMany({
      data: imagesData,
    })

    // Obtener el producto actualizado con relaciones
    const productWithRelations = await prisma.product.findUnique({
      where: { id: updatedProduct.id },
      include: { images: true, category: true },
    })

    return NextResponse.json(productWithRelations, { status: 200 })
  } catch (error) {
    console.error('Error al editar el producto:', error)
    return NextResponse.json({ error: 'Error al editar el producto' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = params
  const token = request.cookies.get('token')?.value
  const user = verifyToken(token)

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    // Eliminar imágenes relacionadas
    await prisma.image.deleteMany({
      where: { productId: parseInt(id, 10) },
    })

    // Eliminar el producto
    await prisma.product.delete({
      where: { id: parseInt(id, 10) },
    })

    return NextResponse.json({ message: 'Producto eliminado exitosamente' }, { status: 200 })
  } catch (error) {
    console.error('Error al eliminar el producto:', error)
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 })
  }
}
