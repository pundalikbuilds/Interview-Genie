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