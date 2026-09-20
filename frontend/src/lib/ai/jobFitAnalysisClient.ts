import type { WorkTICode } from "@/data/workti/worktiData";
import type { JobFitAnalysisResult } from "@/lib/ai/jobFitAnalysisSchema";

export async function requestJobFitAnalysis(jobText: string, workTICode: WorkTICode): Promise<JobFitAnalysisResult> {
  const response = await fetch("/api/job-fit-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobText, workTICode }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok || !body) {
    const message = typeof body?.error === "string" ? body.error : "AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.";
    throw new Error(message);
  }

  return body as JobFitAnalysisResult;
}
