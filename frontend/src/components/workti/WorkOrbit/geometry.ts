/**
 * Pure shape math for WorkOrbit. Nothing here knows about colors, tokens, or
 * Work-TI data — only points and path strings. This is the file to rewrite
 * first when the Orbit's final art direction is designed; WorkOrbit.tsx and
 * its public props should not need to change alongside it.
 */

export interface Point {
  x: number;
  y: number;
}

/** Compass order used everywhere in WorkOrbit: top, right, bottom, left. */
const COMPASS_ANGLES_DEG = [-90, 0, 90, 180] as const;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function rotateAround(point: Point, center: Point, rotationDeg: number): Point {
  const rad = toRad(rotationDeg);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: center.y + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
}

/**
 * The 4 fixed axis-node positions (top/right/bottom/left), independent of
 * any axis "position" value — Work Orbit's compass points don't move, only
 * the ring shapes and center label communicate the data.
 */
export function getAxisNodePositions(center: Point, radius: number): Point[] {
  return COMPASS_ANGLES_DEG.map((angleDeg) => {
    const rad = toRad(angleDeg);
    return {
      x: center.x + radius * Math.cos(rad),
      y: center.y + radius * Math.sin(rad),
    };
  });
}

/**
 * A soft, organic closed loop that passes near the 4 compass nodes —
 * the placeholder stand-in for the final Orbit ring artwork. Swap this
 * function's body to change the ring shape without touching any caller.
 */
export function buildOrbitRingPath(center: Point, radius: number, rotationDeg = 0): string {
  const outer = radius * 1.18;
  const pull = radius * 0.32;

  const rotate = (point: Point) => rotateAround(point, center, rotationDeg);

  const top = rotate({ x: center.x, y: center.y - outer });
  const right = rotate({ x: center.x + outer, y: center.y });
  const bottom = rotate({ x: center.x, y: center.y + outer });
  const left = rotate({ x: center.x - outer, y: center.y });

  const c1 = rotate({ x: center.x + pull, y: center.y - outer - pull });
  const c2 = rotate({ x: center.x + outer + pull, y: center.y - pull });
  const c3 = rotate({ x: center.x + outer + pull, y: center.y + pull });
  const c4 = rotate({ x: center.x + pull, y: center.y + outer + pull });
  const c5 = rotate({ x: center.x - pull, y: center.y + outer + pull });
  const c6 = rotate({ x: center.x - outer - pull, y: center.y + pull });
  const c7 = rotate({ x: center.x - outer - pull, y: center.y - pull });
  const c8 = rotate({ x: center.x - pull, y: center.y - outer - pull });

  return [
    `M ${top.x} ${top.y}`,
    `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${right.x} ${right.y}`,
    `C ${c3.x} ${c3.y} ${c4.x} ${c4.y} ${bottom.x} ${bottom.y}`,
    `C ${c5.x} ${c5.y} ${c6.x} ${c6.y} ${left.x} ${left.y}`,
    `C ${c7.x} ${c7.y} ${c8.x} ${c8.y} ${top.x} ${top.y}`,
    "Z",
  ].join(" ");
}
