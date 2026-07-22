import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const publicRoutes = ["/sign-in", "/sign-up"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  })

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
