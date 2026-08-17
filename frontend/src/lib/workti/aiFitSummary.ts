import type { WorkIdentityMatchResult } from "@/data/workti/worktiData";
import { AXIS_FULL_LABEL, AXIS_LEFT_CODE, AXIS_ORDER, AXIS_TRAIT_LABEL } from "./axisMeta";

const SIMILARITY_THRESHOLD = 70;

export interface AiFitSummary {
  wellMatchedAxes: string[];
  gapAxes: string[];
  summarySentence: string;
}

/**
 * Rule-based stand-in for the OpenAI-generated fit summary described in the
 * PRD — every input here (similarity, selected codes) is real, computed
 * data, just narrated with a template instead of an LLM call. Swap the
 * sentence-building logic for an API call later without touching callers.
 */
export function buildAiFitSummary(match: WorkIdentityMatchResult): AiFitSummary {
  const wellMatchedAxes: string[] = [];
  const gapAxes: string[] = [];
  const sharedTraitPhrases: string[] = [];

  for (const dimension of AXIS_ORDER) {
    const detail = match.axisDetails[dimension];
    const label = AXIS_FULL_LABEL[dimension];

    if (detail.similarity >= SIMILARITY_THRESHOLD) {
      wellMatchedAxes.push(label);
      if (detail.userSelectedCode === detail.companySelectedCode) {
        const trait = AXIS_TRAIT_LABEL[dimension];
        const phrase = detail.userSelectedCode === AXIS_LEFT_CODE[dimension] ? trait.left : trait.right;
        sharedTraitPhrases.push(phrase);
      }
    } else {
      gapAxes.push(label);
    }
  }

  const matchedPart =
    sharedTraitPhrases.length > 0
      ? `${sharedTraitPhrases.join(", ")} 방식이 잘 맞습니다.`
      : "여러 축에서 비슷한 방식으로 일합니다.";

  const gapPart =
    gapAxes.length > 0 ? ` ${gapAxes[0]} 기준에는 차이가 있어 업무 시작 전에 맞춰보면 좋습니다.` : "";

  return {
    wellMatchedAxes,
    gapAxes,
    summarySentence: matchedPart + gapPart,
  };
}
