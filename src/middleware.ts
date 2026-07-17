import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@/lib/supabase/server";

const protectedPaths = ["/dashboard", "/customers", "/plans", "/billing", "/payments", "/tickets", "/technicians"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin-login" && user) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtectedPath && !user) {
    return NextResponse.redirect(
      new URL("/admin-login", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/plans/:path*",
    "/billing/:path*",
    "/payments/:path*",
    "/tickets/:path*",
    "/technicians/:path*",
    "/admin-login",
  ],
};