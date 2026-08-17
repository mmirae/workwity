import type { WorkTIDimension } from "@/data/workti/worktiData";

export type WorkOrbitVariant = "personal" | "company" | "match" | "mini" | "share" | "hero";

export type WorkOrbitColorToken = "orbit-user" | "orbit-company";

/**
 * One axis of a single entity's Work Compass, already reduced to
 * display-ready values. Deliberately generic (not `AxisResult` from
 * worktiData.ts) so WorkOrbit can render mock data, a company's data, or a
 * real test result through the same shape — callers adapt their data into
 * this before passing it in.
 */
export interface WorkOrbitAxisDatum {
  dimension: WorkTIDimension;
  /** Short Korean label for the axis node, e.g. "실행". */
  label: string;
  leftLabel: string;
  rightLabel: string;
  /** 0~100 — 0 sits fully on the left trait, 100 fully on the right trait. */
  position: number;
}

export interface WorkOrbitEntity {
  /** e.g. "구직자" | "기업" — used in the legend and as an aria description. */
  label: string;
  colorToken: WorkOrbitColorToken;
  axes: WorkOrbitAxisDatum[];
}

export interface WorkOrbitProps {
  variant: WorkOrbitVariant;
  primary: WorkOrbitEntity;
  /** Only used by the "match" variant — the entity being compared against. */
  secondary?: WorkOrbitEntity;
  /** Center label, e.g. the 4-letter Work-TI code ("SEMG"). Ignored when matchPercentage is set. */
  centerCode?: string;
  /** Renders "{n}% MATCH" in the core instead of centerCode. */
  matchPercentage?: number;
  /** Pixel size of the (square) SVG viewport. Defaults per variant. */
  size?: number;
  className?: string;
}
