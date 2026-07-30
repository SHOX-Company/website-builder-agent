import { NextRequest, NextResponse } from "next/server";
import { STUDIO_COOKIE, verifySessionToken } from "@/lib/studioAuth";

export const config = {
  matcher: ["/studio/:path*", "/api/studio/:path*"],
};

const PUBLIC_PATHS = new Set(["/studio/login", "/api/studio/login", "/api/studio/logout"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.STUDIO_SESSION_SECRET;
  const token = req.cookies.get(STUDIO_COOKIE)?.value;
  const authed = secret ? await verifySessionToken(token, secret) : false;

  if (!authed) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/studio/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
