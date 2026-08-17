import type { AxisResult, WorkTIDimension } from "@/data/workti/worktiData";
import type { WorkOrbitAxisDatum, WorkOrbitColorToken, WorkOrbitEntity } from "@/components/workti/WorkOrbit";
import { AXIS_COMPASS_LABEL, AXIS_ORDER, AXIS_TRAIT_LABEL } from "./axisMeta";

/**
 * Adapts worktiData.ts's `AxisResult` into WorkOrbit's generic axis shape.
 * `position` follows WorkOrbitAxisDatum's contract: 0 = fully on the left
 * trait, 100 = fully on the right trait.
 */
export function axisResultToOrbitDatum(dimension: WorkTIDimension, axis: AxisResult): WorkOrbitAxisDatum {
  const total = axis.leftScore + axis.rightScore;
  const position = total > 0 ? Math.round((axis.rightScore / total) * 100) : 50;

  return {
    dimension,
    label: AXIS_COMPASS_LABEL[dimension],
    leftLabel: AXIS_TRAIT_LABEL[dimension].left,
    rightLabel: AXIS_TRAIT_LABEL[dimension].right,
    position,
  };
}

export function buildOrbitEntity(
  label: string,
  colorToken: WorkOrbitColorToken,
  axes: Record<WorkTIDimension, AxisResult>
): WorkOrbitEntity {
  return {
    label,
    colorToken,
    axes: AXIS_ORDER.map((dimension) => axisResultToOrbitDatum(dimension, axes[dimension])),
  };
}
