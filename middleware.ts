import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/projects");

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
    return NextResponse.next();
  }
  // console.log("Token in Middleware ", JSON.stringify(token));
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}
