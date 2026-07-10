const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getInterviewReport(sessionId: string) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(
        `${API_URL}/api/report/${sessionId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.detail || "Unable to load interview report."
        );
    }

    return response.json();
}