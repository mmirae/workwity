import type { WorkTIDimension } from "@/data/workti/worktiData";
import { cn } from "@/lib/cn";
import { buildOrbitRingPath, getAxisNodePositions } from "./geometry";
import type { WorkOrbitColorToken, WorkOrbitEntity, WorkOrbitProps } from "./types";

const AXIS_ORDER: readonly WorkTIDimension[] = ["execution", "decision", "speed", "value"];

const DEFAULT_SIZE_BY_VARIANT: Record<WorkOrbitProps["variant"], number> = {
  mini: 96,
  personal: 280,
  company: 280,
  match: 320,
  hero: 360,
  share: 360,
};

// --- Visual layer: the part most likely to change first. Colors resolve to
// the design tokens in globals.css so a token update here flows everywhere.
const COLOR_VAR: Record<WorkOrbitColorToken, string> = {
  "orbit-user": "var(--color-orbit-user)",
  "orbit-company": "var(--color-orbit-company)",
};
const MATCH_COLOR_VAR = "var(--color-orbit-match)";
const DECORATION_COLOR_VAR = "var(--color-primary-100)";

function orderAxes(entity: WorkOrbitEntity) {
  return AXIS_ORDER.map((dimension) => entity.axes.find((axis) => axis.dimension === dimension)).filter(
    (axis): axis is NonNullable<typeof axis> => Boolean(axis)
  );
}

export function WorkOrbit({
  variant,
  primary,
  secondary,
  centerCode,
  matchPercentage,
  size,
  className,
}: WorkOrbitProps) {
  const svgSize = size ?? DEFAULT_SIZE_BY_VARIANT[variant];
  const center = { x: svgSize / 2, y: svgSize / 2 };
  const ringRadius = svgSize * 0.3;
  const nodeRadius = svgSize * (variant === "mini" ? 0.028 : 0.02);
  const coreRadius = svgSize * (variant === "mini" ? 0.32 : 0.19);

  const showLabels = variant !== "mini";
  const showAmbientMotion = variant === "hero" || variant === "match";

  const primaryAxes = orderAxes(primary);
  const secondaryAxes = secondary ? orderAxes(secondary) : null;
  const nodePositions = getAxisNodePositions(center, ringRadius);

  const primaryRingPath = buildOrbitRingPath(center, ringRadius, -6);
  const secondaryRingPath = secondary ? buildOrbitRingPath(center, ringRadius, 8) : null;

  const centerLabel =
    matchPercentage != null ? `${matchPercentage}%` : centerCode ?? undefined;

  return (
    <div className={cn("inline-flex flex-col items-center gap-4", className)}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        role="img"
        aria-label={
          secondary
            ? `${primary.label} Work Orbit와 ${secondary.label} Work Orbit 비교${
                matchPercentage != null ? `, Match ${matchPercentage}%` : ""
              }`
            : `${primary.label} Work Orbit${centerCode ? `, ${centerCode}` : ""}`
        }
      >
        {/* Decoration layer — static background trails, purely ornamental. */}
        <g opacity={0.5} stroke={DECORATION_COLOR_VAR} strokeWidth={1.5} fill="none">
          <ellipse
            cx={center.x}
            cy={center.y}
            rx={ringRadius * 1.3}
            ry={ringRadius * 0.72}
            transform={`rotate(-18 ${center.x} ${center.y})`}
          />
          <ellipse
            cx={center.x}
            cy={center.y}
            rx={ringRadius * 1.3}
            ry={ringRadius * 0.72}
            transform={`rotate(28 ${center.x} ${center.y})`}
          />
        </g>

        {/* Data layer — one ring per entity. */}
        <g className={showAmbientMotion ? "orbit-slow-spin" : undefined}>
          <path
            d={primaryRingPath}
            fill="none"
            stroke={COLOR_VAR[primary.colorToken]}
            strokeWidth={svgSize * 0.014}
          />
          {secondaryRingPath && secondary && (
            <path
              d={secondaryRingPath}
              fill="none"
              stroke={COLOR_VAR[secondary.colorToken]}
              strokeWidth={svgSize * 0.014}
              strokeDasharray={svgSize * 0.02}
            />
          )}
        </g>

        {/* Axis nodes + labels. */}
        {nodePositions.map((point, index) => {
          const axis = primaryAxes[index];
          if (!axis) return null;
          return (
            <g key={axis.dimension}>
              <circle cx={point.x} cy={point.y} r={nodeRadius} fill={COLOR_VAR[primary.colorToken]} />
              {showLabels && (
                <text
                  x={point.x}
                  y={point.y + (point.y < center.y ? -nodeRadius - 10 : nodeRadius + 20)}
                  textAnchor="middle"
                  fontSize={svgSize * 0.05}
                  fontWeight={700}
                  fill="var(--color-gray-950)"
                >
                  {axis.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Core — code or Match %. */}
        <circle
          cx={center.x}
          cy={center.y}
          r={coreRadius}
          fill="white"
          stroke={matchPercentage != null ? MATCH_COLOR_VAR : "var(--color-primary-100)"}
          strokeWidth={2}
        />
        {centerLabel && (
          <text
            x={center.x}
            y={center.y + (matchPercentage != null ? -svgSize * 0.01 : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={svgSize * (variant === "mini" ? 0.16 : 0.11)}
            fontWeight={800}
            fill="var(--color-gray-950)"
          >
            {centerLabel}
          </text>
        )}
        {matchPercentage != null && variant !== "mini" && (
          <text
            x={center.x}
            y={center.y + svgSize * 0.075}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={svgSize * 0.035}
            fill="var(--color-gray-500)"
          >
            MATCH
          </text>
        )}
      </svg>

      {secondary && variant !== "mini" && (
        <div className="flex items-center gap-4 text-body-sm text-gray-700">
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ background: COLOR_VAR[primary.colorToken] }}
              aria-hidden="true"
            />
            {primary.label}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ background: COLOR_VAR[secondary.colorToken] }}
              aria-hidden="true"
            />
            {secondary.label}
          </span>
        </div>
      )}
    </div>
  );
}
