import type { JobAnalysisResult } from "@/lib/ai/jobAnalysisSchema";

/** Calls the server-side /api/job-analysis route. Throws a user-safe error message on failure. */
export async function requestJobAnalysis(text: string): Promise<JobAnalysisResult> {
  const response = await fetch("/api/job-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok || !body) {
    const message = typeof body?.error === "string" ? body.error : "AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.";
    throw new Error(message);
  }

  return body as JobAnalysisResult;
}
