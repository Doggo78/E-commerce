// app/api/categories/[id]/route.js

import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { verifyToken } from '../../../utils/auth'

export async function GET(request, { params }) {
  const { id } = params

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id, 10) },
    })

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error al obtener la categoría:', error)
    return NextResponse.json({ error: 'Error al obtener la categoría' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const { id } = params
  const token = request.cookies.get('token')?.value
  const user = verifyToken(token)

  console.log('Token recibido:', token)
  console.log('Usuario verificado:', user)

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { name } = await request.json()
    console.log('Nombre recibido:', name)

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre de la categoría es requerido' }, { status: 400 })
    }

    // Verificar si la nueva categoría ya existe
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    })
    console.log('Categoría existente:', existingCategory)

    if (existingCategory && existingCategory.id !== parseInt(id, 10)) {
      return NextResponse.json({ error: 'La categoría ya existe' }, { status: 400 })
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id, 10) },
      data: { name },
    })
    console.log('Categoría actualizada:', updatedCategory)

    return NextResponse.json(updatedCategory, { status: 200 })
  } catch (error) {
    console.error('Error al actualizar la categoría:', error)
    return NextResponse.json({ error: 'Error al actualizar la categoría' }, { status: 500 })
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
    // Verificar si hay productos asociados a la categoría
    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(id, 10) },
    })

    if (products.length > 0) {
      return NextResponse.json({ error: 'No se puede eliminar la categoría porque tiene productos asociados' }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id: parseInt(id, 10) },
    })

    return NextResponse.json({ message: 'Categoría eliminada exitosamente' }, { status: 200 })
  } catch (error) {
    console.error('Error al eliminar la categoría:', error)
    return NextResponse.json({ error: 'Error al eliminar la categoría' }, { status: 500 })
  }
}
