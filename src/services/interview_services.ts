const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type DifficultyLevel = "easy" | "intermediate" | "hard";

interface GenerateQuestionPayload {
  jobRole: string;
  skills: string[];
  difficulty: DifficultyLevel;
}

export const generateInterviewQuestion = async (
  payload: GenerateQuestionPayload
) => {
  try {
    const response = await fetch(`${API_BASE}/generate-question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to generate question");
    }

    return data;
  } catch (error) {
    console.error("Interview Question API Error:", error);
    throw error;
  }
};