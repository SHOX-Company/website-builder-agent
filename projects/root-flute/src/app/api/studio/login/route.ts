import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { STUDIO_COOKIE, STUDIO_SESSION_MAX_AGE_SECONDS, createSessionToken } from "@/lib/studioAuth";

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(req);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const secret = process.env.STUDIO_SESSION_SECRET;
  const expectedPassword = process.env.STUDIO_PASSWORD;
  if (!secret || !expectedPassword) {
    return NextResponse.json({ error: "Studio auth is not configured." }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(STUDIO_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // "/" (not "/studio") — Studio's protected API routes live under
    // /api/studio/*, a sibling path the cookie must also reach.
    path: "/",
    maxAge: STUDIO_SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
