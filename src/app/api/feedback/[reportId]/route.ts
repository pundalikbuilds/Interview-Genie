import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

/**
 * GET /api/feedback/[reportId]
 * Returns the full feedback report for a completed interview session.
 * Response shape:
 * {
 *   reportId: string,
 *   candidateName: string,
 *   role: string,
 *   date: string,
 *   durationSeconds: number,
 *   overallScore: number,          // 0-100
 *   overallFeedback: string,
 *   emotionSummary: {
 *     dominantEmotion: string,
 *     averageConfidence: number
 *   },
 *   skills: {
 *     id: number,
 *     name: string,
 *     category: "Technical Skill" | "Soft Skill",
 *     score: number,
 *     feedback: string
 *   }[]
 * }
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const { reportId } = await params;

    const backendResponse = await fetch(
      `${BACKEND_URL}/feedback/${reportId}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json({ error: "Report not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Failed to fetch report" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Feedback service unavailable" },
      { status: 503 }
    );
  }
}
