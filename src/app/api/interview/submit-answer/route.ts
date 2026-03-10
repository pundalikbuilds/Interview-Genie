import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

/**
 * POST /api/interview/submit-answer
 * Body: {
 *   sessionId: string,
 *   questionId: string,
 *   questionText: string,
 *   answerText: string,         // transcribed speech-to-text answer
 *   emotionData: {              // aggregated emotion/confidence from YOLO
 *     dominantEmotion: string,
 *     averageConfidence: number,
 *     emotionLog: { emotion: string, confidence: number, timestamp: number }[]
 *   }
 * }
 * Returns: {
 *   evaluation: { score: number, feedback: string },
 *   nextQuestion: { id: string, text: string } | null  // null = interview over
 * }
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const body = await request.json();
    const { sessionId, questionId, questionText, answerText, emotionData } =
      body;

    if (!sessionId || !questionId || !answerText) {
      return NextResponse.json(
        { error: "sessionId, questionId, and answerText are required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${BACKEND_URL}/interview/submit-answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          sessionId,
          questionId,
          questionText,
          answerText,
          emotionData,
        }),
      }
    );

    if (!backendResponse.ok) {
      const err = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail ?? "Failed to evaluate answer" },
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
