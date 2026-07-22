import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const publicRoutes = ["/sign-in", "/sign-up", "/reset-password"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    if (session) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/sign-in"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
