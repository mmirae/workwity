import type { AxisResult, WorkTIDimension } from "@/lib/workti/workTIEngine";
import { AxisIcon } from "@/components/workti/axisIcons";
import {
  AXIS_ACCENT_COLOR,
  AXIS_ACCENT_SOFT,
  AXIS_BALANCE_LABEL,
  AXIS_ORDER,
  AXIS_TRAIT_LABEL,
} from "@/lib/workti/axisMeta";

/** One axis in the colorful "Work Style" breakdown — a single accent-colored magnitude bar, always visible regardless of which side wins. */
function AxisStyleCard({ dimension, axis }: { dimension: WorkTIDimension; axis: AxisResult }) {
  const traitLabel = AXIS_TRAIT_LABEL[dimension];
  const isLeftDominant = axis.selectedCode === axis.leftCode;
  const dominantLabel = isLeftDominant ? traitLabel.left : traitLabel.right;
  const accent = AXIS_ACCENT_COLOR[dimension];
  const soft = AXIS_ACCENT_SOFT[dimension];

  // Exactly 50% means neither side actually leads, so "OO 우세" would
  // contradict the "동점" note below it — show a balanced phrasing instead.
  const isBalanced = axis.isTie;

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-5 text-center">
      <span
        className="flex size-10 items-center justify-center rounded-full"
        style={{ background: soft, color: accent }}
      >
        <AxisIcon dimension={dimension} />
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-caption text-gray-400">
          {traitLabel.left} vs {traitLabel.right}
        </span>
        <span className="text-body-sm font-bold text-gray-950">
          {isBalanced ? AXIS_BALANCE_LABEL[dimension] : `${dominantLabel} 우세`}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
        <span
          className="block h-full rounded-full"
          style={{ width: `${axis.selectedPercentage}%`, background: accent }}
        />
      </div>
      <span className="text-heading-3 font-extrabold" style={{ color: accent }}>
        {axis.selectedPercentage}%{isBalanced ? " · 균형" : ""}
      </span>
    </div>
  );
}

/**
 * The "✦ WORK STYLE ✦" 4-axis breakdown — shared by the job-seeker report
 * card (WorkTIReportCard) and the company result page, since both datasets
 * produce the exact same `AxisResult` shape for the same 4 dimensions.
 */
export function AxisStyleGrid({ axes }: { axes: Record<WorkTIDimension, AxisResult> }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-body-sm font-bold tracking-wide text-gray-950">✦ WORK STYLE ✦</h3>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {AXIS_ORDER.map((dimension) => (
          <AxisStyleCard key={dimension} dimension={dimension} axis={axes[dimension]} />
        ))}
      </div>
    </div>
  );
}
