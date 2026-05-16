import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("adminToken")?.value;

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  try {
    // jose requires the secret to be encoded as a Uint8Array
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
