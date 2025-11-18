import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutePrefix = "/a";
const publicRoutes = ["/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = path.startsWith(protectedRoutePrefix);

  const isPublicRoute = publicRoutes.includes(path);

  const headers = new Headers(req.headers);
  headers.set("x-current-path", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/a", req.url));
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
