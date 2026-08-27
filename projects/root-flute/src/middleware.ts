import { NextRequest, NextResponse } from "next/server";
import { STUDIO_COOKIE, verifySessionToken } from "@/lib/studioAuth";

export const config = {
  matcher: ["/studio/:path*", "/api/studio/:path*", "/promoter", "/promoter/:path*"],
};

const PUBLIC_PATHS = new Set(["/studio/login", "/api/studio/login", "/api/studio/logout"]);

// Header name the Music page reads to know it was reached via /promoter.
// Kept in sync with the identical literal in src/app/music/page.tsx.
const PROMOTER_VIEW_HEADER = "x-promoter-view";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Promoter mirror: /promoter/* transparently serves the same page that
  // already exists at the un-prefixed path (URL bar keeps the /promoter
  // prefix; the router resolves the stripped path). /promoter/studio is
  // excluded so the private admin app can never be reached through it.
  const isPromoterPath = pathname === "/promoter" || pathname.startsWith("/promoter/");
  if (isPromoterPath && !pathname.startsWith("/promoter/studio")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/promoter" ? "/" : pathname.slice("/promoter".length);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set(PROMOTER_VIEW_HEADER, "1");
    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    // The canonical tag alone is a hint, not a directive — a crawler that
    // discovers a /promoter/* URL before ever crawling the canonical one
    // could still index it as separate duplicate content. This header is a
    // hard instruction search engines respect regardless of canonical.
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

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
