import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if accessing admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/admin-simple')) {
    // Allow access to login page (both with and without trailing slash)
    if (pathname === '/admin/login' || pathname === '/admin/login/') {
      console.log(`✅ Allowing access to login page: ${pathname}`)
      return NextResponse.next()
    }

    // Check for admin token in cookies
    const adminToken = request.cookies.get('adminToken')?.value
    
    if (!adminToken) {
      // Redirect to simple login page if not authenticated
      console.log(`❌ Access denied to ${pathname}: Missing auth cookies`)
      return NextResponse.redirect(new URL('/simple-login', request.url))
    }

    // Check if token is valid (basic check)
    try {
      const tokenData = JSON.parse(atob(adminToken))
      if (tokenData.expires < Date.now()) {
        // Token expired, redirect to login
        console.log(`❌ Access denied to ${pathname}: Token expired`)
        const response = NextResponse.redirect(new URL('/simple-login', request.url))
        response.cookies.delete('adminToken')
        return response
      }
      console.log(`✅ Access granted to ${pathname} for user: ${tokenData.email}`)
    } catch (error) {
      // Invalid token, redirect to login
      console.log(`❌ Access denied to ${pathname}: Invalid token`)
      const response = NextResponse.redirect(new URL('/simple-login', request.url))
      response.cookies.delete('adminToken')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin-simple/:path*']
} 