export interface JobApplication {
  jobId: string;
  /** Match% at the moment of applying — per IA, this is snapshotted, not recomputed later. */
  matchPctSnapshot?: number;
  appliedAt: string;
  shareReport: boolean;
}

const KEY = "workwity:applications";

function readAll(): JobApplication[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as JobApplication[];
  } catch {
    return [];
  }
}

export function getApplications(): JobApplication[] {
  return readAll();
}

export function getApplication(jobId: string): JobApplication | undefined {
  return readAll().find((app) => app.jobId === jobId);
}

export function hasApplied(jobId: string): boolean {
  return readAll().some((app) => app.jobId === jobId);
}

export function saveApplication(application: JobApplication): void {
  const all = readAll().filter((app) => app.jobId !== application.jobId);
  all.push(application);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}
