import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

/**
 * POST /api/auth/signup
 * Body: { name: string, email: string, password: string }
 * Returns: { token: string, user: { id, name, email } }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!backendResponse.ok) {
      const err = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail ?? "Registration failed" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    const response = NextResponse.json(
      { user: data.user, token: data.token },
      { status: 201 }
    );

    // Set HTTP-only cookie with the JWT token
    response.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 503 }
    );
  }
}
