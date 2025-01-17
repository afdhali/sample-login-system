// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return null;
  }

  if (!token) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    // Proteksi semua route
    "/((?!api|_next/static|_next/image|favicon.ico|images|public).*)",
    // Khusus untuk auth pages
    "/auth/:path*",
  ],
};
