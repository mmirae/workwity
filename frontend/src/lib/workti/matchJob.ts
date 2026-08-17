import {
  calculateWorkIdentityMatch,
  createWorkTIResultFromScores,
  type TraitScores,
  type WorkIdentityMatchResult,
} from "@/data/workti/worktiData";
import type { StoredWorkTIResult } from "./testStorage";

/**
 * Real Work Identity Match between a stored personal result and a
 * (mock, for now) company score vector — same calculation the backend will
 * eventually run, just fed mock company data until companies can take the
 * test themselves.
 */
export function computeJobMatch(userResult: StoredWorkTIResult, companyScores: TraitScores): WorkIdentityMatchResult {
  const userFull = createWorkTIResultFromScores(userResult.scores);
  const companyFull = createWorkTIResultFromScores(companyScores);
  return calculateWorkIdentityMatch(userFull, companyFull);
}
