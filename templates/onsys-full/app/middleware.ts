// app/middleware.ts
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const protectedRoutePrefix = "/a"  // qualquer rota que comece com /a é protegida
const publicRoutes = ["/signup", "/"]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // 1. Verifica se é rota protegida
  const isProtectedRoute = path.startsWith(protectedRoutePrefix)

  // 2. Verifica se é rota pública
  const isPublicRoute = publicRoutes.includes(path)

  const headers = new Headers(req.headers);
  headers.set("x-current-path", req.nextUrl.pathname);

  // 3. Obtenha o token da sessão NextAuth (JWT)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // 4. Redireciona se não autenticado em rota protegida
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // 5. Redireciona se autenticado em rota pública
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/a", req.url))
  }

  // 6. Se nada disso, deixa passar
  return NextResponse.next({ headers })
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"], // ignora assets e API
}
