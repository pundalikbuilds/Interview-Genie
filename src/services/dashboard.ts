const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDashboard() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/api/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load dashboard.");
  }

  return await response.json();
}

// ── NEW ────────────────────────────────────────────────────────────────
export async function deleteDashboardInterview(sessionId: string) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_URL}/api/dashboard/${sessionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Unable to delete interview.");
  }

  return response.json();
}
// ── END NEW ──────────────────────────────────────────────────────────