const KEY = "workwity:saved-jobs";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function getSavedJobIds(): string[] {
  return readIds();
}

export function isJobSaved(jobId: string): boolean {
  return readIds().includes(jobId);
}

export function toggleSavedJob(jobId: string): string[] {
  const current = readIds();
  const next = current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
