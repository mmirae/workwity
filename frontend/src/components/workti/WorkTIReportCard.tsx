import type {
  AxisResult,
  BonusBadgeResult,
  WorkTICode,
  WorkTIDimension,
  WorkTIResultDefinition,
} from "@/data/workti/worktiData";
import { WORK_TI_RESULT_DETAILS } from "@/data/workti/worktiData";
import type { ReactNode } from "react";
import { ReportHero } from "@/components/workti/ReportHero";
import { AxisStyleGrid } from "@/components/workti/AxisStyleGrid";
import { WorkTISummary } from "@/components/workti/WorkTISummary";

interface WorkTIReportCardProps {
  code: WorkTICode;
  definition: WorkTIResultDefinition;
  axes: Record<WorkTIDimension, AxisResult>;
  bonusBadges?: BonusBadgeResult[];
  kicker?: string;
  /** Overrides the WorkTIResultDetail-derived emoji if passed; otherwise looked up by `code`. */
  characterIcon?: string;
  /** Page-specific buttons (e.g. "테스트 다시 하기"), rendered in the Hero header band. */
  actions?: ReactNode;
}

/**
 * Shared Hero + Work Style + Summary block for the seeker's compact result
 * view (/me) and the company mypage "기업 Work-TI" dashboard tab. The full
 * seeker report adds its own SECTION 01-05 content below this
 * (WorkTIResultDetailSections); the mypage tab uses this alone as a preview.
 */
export function WorkTIReportCard({
  code,
  definition,
  axes,
  bonusBadges = [],
  kicker = "WORK IDENTITY REPORT",
  characterIcon,
  actions,
}: WorkTIReportCardProps) {
  const resolvedIcon = characterIcon ?? WORK_TI_RESULT_DETAILS[code].characterIcon;

  return (
    <div className="flex flex-col gap-8">
      <ReportHero
        kicker={kicker}
        code={code}
        title={definition.title}
        catchphrase={definition.catchphrase}
        tags={definition.tags}
        characterIcon={resolvedIcon}
        actions={actions}
      />

      <AxisStyleGrid axes={axes} />
      <WorkTISummary text={definition.description} />

      {bonusBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-5">
          <span className="text-caption font-semibold text-gray-400">조직 언어 패치</span>
          {bonusBadges.map((badge) => (
            <span
              key={badge.questionId}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-caption font-medium text-gray-600"
            >
              {badge.badgeTag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
