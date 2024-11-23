// app/api/auth/me/route.js

import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/prisma';


export async function GET(request) {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // Obtener información del usuario desde la base de datos
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ user: userData }, { status: 200 });
}
