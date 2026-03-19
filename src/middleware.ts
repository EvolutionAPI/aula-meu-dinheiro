import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { jwtSecret } from '@/lib/auth'

const publicRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      try {
        await jwtVerify(token, jwtSecret)
        return NextResponse.redirect(new URL('/', request.url))
      } catch {
        /* invalid token, allow access to login/register */
      }
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, jwtSecret)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.|.*\\.(?:html|png|svg|ico|jpg|jpeg|webp|gif)$).*)'],
}
