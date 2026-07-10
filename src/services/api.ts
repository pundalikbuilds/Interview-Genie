const DEFAULT_API_ORIGIN = "http://localhost:8000";

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getApiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!raw) {
    return DEFAULT_API_ORIGIN;
  }

  // Accept either http://host or http://host/api from env without duplicating /api.
  return trimTrailingSlashes(raw).replace(/\/api$/, "");
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const apiPath = normalizedPath.startsWith("/api/")
    ? normalizedPath
    : `/api${normalizedPath}`;

  return `${getApiOrigin()}${apiPath}`;
}

export function buildWsUrl(path: string): string {
  const httpUrl = new URL(buildApiUrl(path));
  httpUrl.protocol = httpUrl.protocol === "https:" ? "wss:" : "ws:";
  return httpUrl.toString();
}