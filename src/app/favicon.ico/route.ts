import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL("/next.svg", request.url);
  return NextResponse.redirect(url, 307);
}
