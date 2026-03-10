import { NextResponse } from "next/server";

const BACKEND_PREDICT_URL =
  process.env.PREDICTION_BACKEND_URL ?? "http://127.0.0.1:8000/predict";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing file in form-data" },
        { status: 400 }
      );
    }

    const forwardData = new FormData();
    forwardData.append("file", file, "frame.jpg");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const backendResponse = await fetch(BACKEND_PREDICT_URL, {
      method: "POST",
      body: forwardData,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: `Backend returned ${backendResponse.status}` },
        { status: 503 }
      );
    }

    const result = await backendResponse.json();
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Prediction backend unavailable" },
      { status: 503 }
    );
  }
}
