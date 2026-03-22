import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

/**
 * GET /api/user/profile
 * Returns the authenticated user's profile and interview history.
 * Response: {
 *   id: string,
 *   name: string,
 *   email: string,
 *   createdAt: string,
 *   interviewHistory: {
 *     reportId: string,
 *     role: string,
 *     date: string,
 *     overallScore: number,
 *     durationSeconds: number
 *   }[]
 * }
 *
 * PUT /api/user/profile
 * Body: { name?: string, email?: string, currentPassword?: string, newPassword?: string }
 * Updates the authenticated user's profile details.
 */

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const backendResponse = await fetch(`${BACKEND_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "User service unavailable" },
      { status: 503 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    const backendResponse = await fetch(`${BACKEND_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const err = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail ?? "Failed to update profile" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "User service unavailable" },
      { status: 503 }
    );
  }
}
