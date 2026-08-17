/**
 * Korean display labels for the 6 bonus/language-culture categories — shared
 * by the seeker (`BonusCategory`) and company (`CompanyBonusCategory`)
 * datasets, which use the exact same 6 category keys.
 */
export const BONUS_CATEGORY_ORDER = [
  "terms",
  "title",
  "feedback",
  "meeting",
  "messenger",
  "documentation",
] as const;

export const BONUS_CATEGORY_LABEL: Record<string, string> = {
  terms: "용어 문화",
  title: "호칭 문화",
  feedback: "피드백",
  meeting: "회의",
  messenger: "메신저",
  documentation: "문서화",
};
