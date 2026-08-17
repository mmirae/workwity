import type { MainTraitCode, WorkTIDimension } from "@/data/workti/worktiData";

/** Canonical compass order used everywhere: top, right, bottom, left. */
export const AXIS_ORDER: readonly WorkTIDimension[] = ["execution", "decision", "speed", "value"];

/** Short label for compass nodes / kickers, e.g. "실행". */
export const AXIS_COMPASS_LABEL: Record<WorkTIDimension, string> = {
  execution: "실행",
  decision: "결정",
  speed: "속도",
  value: "가치",
};

/** Longer label for section headings and question tags, e.g. "실행 스타일". */
export const AXIS_FULL_LABEL: Record<WorkTIDimension, string> = {
  execution: "실행 스타일",
  decision: "의사결정",
  speed: "속도·디테일",
  value: "가치 지향",
};

/** Human-readable left/right trait names per Brand Language §5 Work Compass table. */
export const AXIS_TRAIT_LABEL: Record<WorkTIDimension, { left: string; right: string }> = {
  execution: { left: "가설 실행", right: "리서치 분석" },
  decision: { left: "자율 주도", right: "체계·합의" },
  speed: { left: "속도·린", right: "완성도·정교" },
  value: { left: "성장·도전", right: "안정·조화" },
};

/** Which raw trait code sits on the "left" side of each axis (mirrors worktiData.ts's DIMENSION_CONFIG, which isn't exported). */
export const AXIS_LEFT_CODE: Record<WorkTIDimension, MainTraitCode> = {
  execution: "S",
  decision: "E",
  speed: "M",
  value: "G",
};

/**
 * Presentation label for the exact-50% ("동점") case — "OO 우세" doesn't make
 * sense when neither side actually leads, so this describes the axis as
 * balanced instead, worded naturally per axis rather than concatenating the
 * two AXIS_TRAIT_LABEL halves verbatim.
 */
export const AXIS_BALANCE_LABEL: Record<WorkTIDimension, string> = {
  execution: "실행·분석 균형",
  decision: "자율·체계 균형",
  speed: "속도·완성도 균형",
  value: "성장·안정 균형",
};

/**
 * One accent color per axis for the "Work Style" breakdown — the single
 * shared source both the seeker and company reports read from, so the two
 * always render identical axis colors. Values are the dedicated Work Style
 * Axis Colors tokens (globals.css / design doc §2), not the semantic
 * success/warning/orbit tokens — those carry unrelated meanings (success,
 * caution, Orbit charts) that would clash if reused here.
 */
export const AXIS_ACCENT_COLOR: Record<WorkTIDimension, string> = {
  execution: "var(--color-primary-600)",
  decision: "var(--color-teal-600)",
  speed: "var(--color-violet-600)",
  value: "var(--color-coral-600)",
};

/** Soft background tint per axis, paired with AXIS_ACCENT_COLOR for icon chips. */
export const AXIS_ACCENT_SOFT: Record<WorkTIDimension, string> = {
  execution: "var(--color-primary-50)",
  decision: "var(--color-teal-100)",
  speed: "var(--color-violet-100)",
  value: "var(--color-coral-100)",
};
