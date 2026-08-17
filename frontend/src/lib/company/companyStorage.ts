import type { StoredWorkTIResult } from "@/lib/workti/testStorage";

export interface CompanyProfile {
  name: string;
  registrationNumber?: string;
  size: string;
  industry: string;
  intro?: string;
}

const PROFILE_KEY = "workwity:company-profile";
const RESULT_KEY = "workwity:company-workti-result";

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveCompanyProfile(profile: CompanyProfile): void {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getCompanyProfile(): CompanyProfile | null {
  return readJSON<CompanyProfile>(PROFILE_KEY);
}

/** Same shape as the job seeker's stored result — the calculation and storage
 * pattern are identical, only the localStorage key differs. */
export function saveCompanyResult(result: StoredWorkTIResult): void {
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function getCompanyResult(): StoredWorkTIResult | null {
  return readJSON<StoredWorkTIResult>(RESULT_KEY);
}

/**
 * `useSyncExternalStore`-compatible reader for one localStorage key. Caches
 * the last parsed value against the last raw string so unchanged storage
 * returns the *same* object reference on repeated calls — required because
 * React calls `getSnapshot` on every render to check for changes, and a
 * reader that reparses (and thus reallocates) every time would look like it
 * "changed" every render, sending `useSyncExternalStore` into a render loop.
 */
function createStorageSnapshot<T>(key: string) {
  let lastRaw: string | null = null;
  let lastParsed: T | null = null;

  return (): T | null => {
    if (typeof window === "undefined") return null;

    const raw = window.localStorage.getItem(key);
    if (raw !== lastRaw) {
      lastRaw = raw;
      try {
        lastParsed = raw ? (JSON.parse(raw) as T) : null;
      } catch {
        lastParsed = null;
      }
    }
    return lastParsed;
  };
}

export const getCompanyResultSnapshot = createStorageSnapshot<StoredWorkTIResult>(RESULT_KEY);
export const getCompanyProfileSnapshot = createStorageSnapshot<CompanyProfile>(PROFILE_KEY);

/** Always-null snapshot for SSR/static prerendering, where localStorage doesn't exist. */
export function getCompanyStorageServerSnapshot(): null {
  return null;
}

/**
 * We only need a one-time, hydration-safe read (matching the previous
 * effect-based behavior, which also only read once on mount) — not live
 * updates when another tab changes storage — so this never actually calls
 * back into React.
 */
export function subscribeToCompanyStorage(): () => void {
  return () => {};
}
