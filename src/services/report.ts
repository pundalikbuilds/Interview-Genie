const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getInterviewReport(sessionId: string) {
    const token = localStorage.getItem("access_token");
    console.log("Fetching report for session:", sessionId);
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

export async function updateInterviewDuration(
    sessionId: string,
    durationSeconds: number
) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(
        `${API_URL}/api/report/${sessionId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                durationSeconds,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.detail || "Unable to update interview duration."
        );
    }

    return response.json();
}