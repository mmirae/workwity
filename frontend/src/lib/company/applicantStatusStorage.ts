export type ApplicantStatus = "신규" | "검토중" | "합격" | "불합격";

const KEY = "workwity:applicant-status";

function readAll(): Record<string, ApplicantStatus> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, ApplicantStatus>;
  } catch {
    return {};
  }
}

export function getApplicantStatus(applicantId: string): ApplicantStatus {
  return readAll()[applicantId] ?? "신규";
}

export function setApplicantStatus(applicantId: string, status: ApplicantStatus): void {
  const next = { ...readAll(), [applicantId]: status };
  window.localStorage.setItem(KEY, JSON.stringify(next));
}
