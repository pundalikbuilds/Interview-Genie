import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

/**
 * POST /api/interview/generate-questions
 * Body: { jobRole: string, skills: string[], difficulty: "easy" | "intermediate" | "hard" }
 * Returns: { sessionId: string, questions: { id: string, text: string }[] }
 *
 * Calls the backend AI service to generate tailored interview questions
 * based on the candidate's selected role, skills, and difficulty level.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const body = await request.json();
    const { jobRole, skills, difficulty } = body;

    if (!jobRole || !skills?.length || !difficulty) {
      return NextResponse.json(
        { error: "jobRole, skills, and difficulty are required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${BACKEND_URL}/interview/generate-questions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ jobRole, skills, difficulty }),
      }
    );

    if (!backendResponse.ok) {
      const err = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail ?? "Failed to generate questions" },
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
