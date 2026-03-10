import { NextResponse } from "next/server";

/**
 * POST /api/auth/signout
 * Clears the auth cookie and ends the session.
 */
export async function POST() {
  const response = NextResponse.json(
    { message: "Signed out successfully" },
    { status: 200 }
  );

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
