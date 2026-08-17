const KEY = "workwity:recent-jobs";
const MAX_ENTRIES = 5;

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function getRecentJobIds(): string[] {
  return readIds();
}

export function recordRecentJob(jobId: string): void {
  const deduped = [jobId, ...readIds().filter((id) => id !== jobId)].slice(0, MAX_ENTRIES);
  window.localStorage.setItem(KEY, JSON.stringify(deduped));
}
