import type {
  AxisResult,
  BonusAnswers,
  BonusBadgeResult,
  BonusOptionLabel,
  MainAnswers,
  MainTraitCode,
  TraitScores,
  WorkTICode,
  WorkTIDimension,
} from "@/data/workti/worktiData";

/**
 * Local-storage stand-in for the real persistence layer. Swap the bodies of
 * these functions for Supabase calls later — callers (test pages, /me) only
 * depend on the function signatures below, not on `localStorage` directly.
 */

const ANSWERS_KEY = "workwity:test-answers";
const RESULT_KEY = "workwity:test-result";

interface StoredAnswers {
  main: MainAnswers;
  bonus: BonusAnswers;
}

export interface StoredWorkTIResult {
  code: WorkTICode;
  scores: TraitScores;
  axes: Record<WorkTIDimension, AxisResult>;
  bonusBadges: BonusBadgeResult[];
}

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getStoredAnswers(): StoredAnswers {
  return readJSON<StoredAnswers>(ANSWERS_KEY) ?? { main: {}, bonus: {} };
}

export function saveMainAnswer(questionId: number, code: MainTraitCode): StoredAnswers {
  const current = getStoredAnswers();
  const next: StoredAnswers = { ...current, main: { ...current.main, [questionId]: code } };
  window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(next));
  return next;
}

export function saveBonusAnswer(questionId: number, label: BonusOptionLabel): StoredAnswers {
  const current = getStoredAnswers();
  const next: StoredAnswers = { ...current, bonus: { ...current.bonus, [questionId]: label } };
  window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(next));
  return next;
}

export function clearStoredAnswers(): void {
  window.localStorage.removeItem(ANSWERS_KEY);
}

export function saveResult(result: StoredWorkTIResult): void {
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function getStoredResult(): StoredWorkTIResult | null {
  return readJSON<StoredWorkTIResult>(RESULT_KEY);
}
