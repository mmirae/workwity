import type { ReactElement } from "react";
import type { WorkTIDimension } from "@/data/workti/worktiData";

// Design System §19 — 1.5~2px line icons only, no robot/brain/circuit/rocket/planet motifs.
// One glyph per Work-TI axis, used by the "Work Style" breakdown.

function ExecutionAxisIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15.3 15.3L20 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function DecisionAxisIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19c0-3 2.4-5.2 5.5-5.2s5.5 2.2 5.5 5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.8 19c0-2.4 1-4.3 3.5-4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SpeedAxisIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ValueAxisIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5v17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 7.5h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 7.5l-2.5 5a2.5 2.5 0 0 0 5 0l-2.5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M19 7.5l-2.5 5a2.5 2.5 0 0 0 5 0l-2.5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 20.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const AXIS_ICON: Record<WorkTIDimension, () => ReactElement> = {
  execution: ExecutionAxisIcon,
  decision: DecisionAxisIcon,
  speed: SpeedAxisIcon,
  value: ValueAxisIcon,
};

/** Small line icon representing one Work-TI axis (magnifying glass / people / target / scale). */
export function AxisIcon({ dimension }: { dimension: WorkTIDimension }) {
  const Icon = AXIS_ICON[dimension];
  return <Icon />;
}
