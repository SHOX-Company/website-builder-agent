import { NextResponse } from "next/server";
import { STUDIO_COOKIE } from "@/lib/studioAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(STUDIO_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  // Also clear the old Phase 1 cookie scope (path=/studio) in case this
  // browser still holds one from before Phase 2 widened the cookie to "/".
  res.cookies.set(STUDIO_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/studio",
    maxAge: 0,
  });
  return res;
}
