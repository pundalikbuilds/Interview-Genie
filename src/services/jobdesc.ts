export type JobDetailsPayload = {
  userId: string;
  candidateName: string;
  jobRole: string;
  skills: string[];
  difficulty: "easy" | "intermediate" | "hard";
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function sendJobDetails(payload: JobDetailsPayload) {
  console.log("Sending job details:", payload);

  const response = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      description: `${payload.jobRole} | Skills: ${payload.skills.join(", ")} | Difficulty: ${payload.difficulty}`,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Failed to create interview");
  }

  return response.json();
}