import type { WorkIdentityMatchResult, WorkTIDimension } from "@/data/workti/worktiData";
import { AXIS_TRAIT_LABEL } from "@/lib/workti/axisMeta";

interface CompareAxisRowProps {
  dimension: WorkTIDimension;
  detail: WorkIdentityMatchResult["axisDetails"][WorkTIDimension];
  primaryColor?: string;
  secondaryColor?: string;
}

/** Two-marker track comparing where each side sits on one Work Compass axis. */
export function CompareAxisRow({
  dimension,
  detail,
  primaryColor = "var(--color-orbit-user)",
  secondaryColor = "var(--color-orbit-company)",
}: CompareAxisRowProps) {
  const trait = AXIS_TRAIT_LABEL[dimension];
  const primaryOffset = 100 - detail.userPosition;
  const secondaryOffset = 100 - detail.companyPosition;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-caption text-gray-500">
        <span>{trait.left}</span>
        <span>{trait.right}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-gray-100">
        <span
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${primaryOffset}%`, background: primaryColor }}
        />
        <span
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{ left: `${secondaryOffset}%`, background: secondaryColor }}
        />
      </div>
      <span className="text-caption text-gray-400">유사도 {detail.similarity}%</span>
    </div>
  );
}
