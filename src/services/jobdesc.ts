export type JobDetailsPayload = {
  userId: string;
  jobRole: string;
  skills: string[];
  difficulty: "easy" | "intermediate" | "hard";
};

export async function sendJobDetails(payload: JobDetailsPayload) {
  console.log("Sending job details:", payload);

  const response = await fetch("http://localhost:8000/api/sessions", {
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
    throw new Error("Failed to create interview");
  }

  return response.json();
}