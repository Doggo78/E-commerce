// middleware.js

import { NextResponse } from 'next/server'
import { verifyToken } from './auth'
import cookie from 'cookie'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Rutas protegidas para ADMIN
  if (pathname.startsWith('/admin')) {
    const cookies = request.headers.get('cookie') || ''
    const parsedCookies = cookie.parse(cookies)
    const token = parsedCookies.token

    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const user = verifyToken(token)

    if (!user || user.role !== 'ADMIN') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
