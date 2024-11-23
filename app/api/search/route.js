import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { q, category } = req.query; // Obtenemos el término de búsqueda y la categoría

  try {
    // Realizamos la búsqueda y el filtrado por categoría si se proporcionan
    const products = await prisma.product.findMany({
      where: {
        AND: [
          category ? { category: { equals: category, mode: 'insensitive' } } : {},
          {
            OR: [
              { name: { contains: q || '', mode: 'insensitive' } },
              { description: { contains: q || '', mode: 'insensitive' } },
            ],
          },
        ],
      },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
