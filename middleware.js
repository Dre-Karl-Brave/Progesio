import { NextResponse } from 'next/server'

const COOKIE_NAME = 'progresio_token'

export function middleware(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const { pathname } = request.nextUrl

  // Redirect unauthenticated users away from protected routes
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/sign-in' || pathname === '/sign-up') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
}
