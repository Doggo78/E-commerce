// app/api/auth/logout.js

export default function handler(req, res) {
  // Eliminar la cookie
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
  res.status(200).json({ message: 'Sesión cerrada' })
}
export async function POST(request) {
  // Implementa la lógica de logout, por ejemplo, eliminando cookies
  const response = NextResponse.json({ message: 'Logout exitoso' }, { status: 200 });
  response.cookies.set('token', '', { maxAge: -1 }); // Elimina el token
  return response;
}