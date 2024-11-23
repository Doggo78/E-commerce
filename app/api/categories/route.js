// app/api/categories/route.js

import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export async function GET(request) {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}

export async function POST(request) {
  const token = request.cookies.get('token')?.value
  const user = verifyToken(token)
  console.log('Token recibido:', token)
  console.log('Usuario verificado:', user)

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { name } = await request.json()
    console.log('Nombre de la categoría recibido:', name)

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre de la categoría es requerido' }, { status: 400 })
    }

    // Verificar si la categoría ya existe
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    })
    console.log('Categoría existente:', existingCategory)

    if (existingCategory) {
      return NextResponse.json({ error: 'La categoría ya existe' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name },
    })
    console.log('Categoría creada:', category)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error al crear la categoría:', error)
    return NextResponse.json({ error: 'Error al crear la categoría' }, { status: 500 })
  }
}
