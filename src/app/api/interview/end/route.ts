import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

/**
 * POST /api/interview/end
 * Body: {
 *   sessionId: string,
 *   durationSeconds: number,
 *   emotionSummary: {
 *     dominantEmotion: string,
 *     averageConfidence: number
 *   }
 * }
 * Returns: { reportId: string }
 *
 * Signals the backend to finalise the session, trigger report generation,
 * and return a reportId that can be used to fetch the feedback page.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const body = await request.json();
    const { sessionId, durationSeconds, emotionSummary } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_URL}/interview/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ sessionId, durationSeconds, emotionSummary }),
    });

    if (!backendResponse.ok) {
      const err = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail ?? "Failed to end interview session" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Interview service unavailable" },
      { status: 503 }
    );
  }
}
