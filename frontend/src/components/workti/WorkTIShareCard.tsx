import { forwardRef } from "react";
import type {
  AxisResult,
  WorkTICode,
  WorkTIDimension,
  WorkTIResultDefinition,
  WorkTIResultDetail,
} from "@/data/workti/worktiData";
import { AXIS_BALANCE_LABEL, AXIS_ORDER, AXIS_TRAIT_LABEL } from "@/lib/workti/axisMeta";
import { WorkTICharacterImage } from "@/components/workti/WorkTICharacterImage";

interface WorkTIShareCardProps {
  code: WorkTICode;
  definition: WorkTIResultDefinition;
  axes: Record<WorkTIDimension, AxisResult>;
  detail: WorkTIResultDetail;
}

const CARD_WIDTH = 640;

/** Same accent palette as AxisStyleGrid's Work Style band (lib/workti/axisMeta's AXIS_ACCENT_COLOR), as literal hex — this file avoids CSS var()/Tailwind everywhere else, so the axis colors stay consistent with that convention. */
const AXIS_ACCENT_HEX: Record<WorkTIDimension, string> = {
  execution: "#2563eb",
  decision: "#0e8f9e",
  speed: "#7c3aed",
  value: "#d9704f",
};

function ShareAxisCard({ dimension, axis }: { dimension: WorkTIDimension; axis: AxisResult }) {
  const traitLabel = AXIS_TRAIT_LABEL[dimension];
  const isLeftDominant = axis.selectedCode === axis.leftCode;
  const displayLabel = axis.isTie ? AXIS_BALANCE_LABEL[dimension] : isLeftDominant ? traitLabel.left : traitLabel.right;
  const accent = AXIS_ACCENT_HEX[dimension];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "14px 8px",
        borderRadius: 12,
        background: "#f9fafb",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{displayLabel}</span>
      <div style={{ width: "100%", height: 6, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
        <span
          style={{ display: "block", height: "100%", width: `${axis.selectedPercentage}%`, background: accent }}
        />
      </div>
      <span style={{ fontSize: 17, fontWeight: 800, color: accent }}>
        {axis.selectedPercentage}%
      </span>
    </div>
  );
}

/**
 * Compact, self-contained, character-centered share graphic for
 * "결과 이미지로 저장하기" — deliberately separate from WorkTIReportCard (which
 * carries the full description, bonus badges, and Work Style/Orbit Summary
 * sections meant for the in-app report, not a social share image). Rendered
 * off-screen and rasterized with html2canvas-pro. Mirrors WorkTIReportCard's
 * Hero hierarchy at share-card scale: huge mono CODE, a separate title line,
 * a Royal Blue catchphrase, then a large frameless character illustration —
 * not a boxed thumbnail.
 *
 * Layout/structure is mostly inline styles (not Tailwind) because that's
 * what was verified to rasterize reliably here; WorkTICharacterImage is the
 * one Tailwind-based piece reused as-is (html2canvas-pro reads computed
 * styles regardless of Tailwind vs. inline authoring, unlike the previous
 * html-to-image approach this replaced).
 */
export const WorkTIShareCard = forwardRef<HTMLDivElement, WorkTIShareCardProps>(function WorkTIShareCard(
  { code, definition, axes, detail },
  ref
) {
  const tags = definition.tags.slice(0, 4);

  return (
    <div
      ref={ref}
      style={{
        width: CARD_WIDTH,
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        fontFamily: "var(--font-sans)",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rasterized off-screen via html2canvas-pro; next/image's optimizer proxy breaks that capture. */}
          <img
            src="/brand/workwity-symbol.png"
            alt=""
            width={26}
            height={26}
            style={{ display: "block", width: 26, height: 26, maxWidth: "none" }}
          />
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em" }}>Workwity</span>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
          WORK-TI RESULT
        </span>
      </div>

      {/*
        Hero — same hierarchy as WorkTIReportCard: huge CODE, title on its own
        line, Royal Blue catchphrase, then oneLiner and tags. The character
        is a large frameless illustration bottom-anchored in its own ~42%
        column, not a small boxed thumbnail.
      */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18, background: "#dbeafe", padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "1 1 330px", minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 40,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "0.01em",
                  color: "#2563eb",
                }}
              >
                {code}
              </span>
              <span style={{ fontSize: 25, fontWeight: 700, color: "#0f172a" }}>{definition.title}</span>
            </div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.5, color: "#0f172a" }}>
              &ldquo;{definition.catchphrase}&rdquo;
            </p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#374151" }}>{detail.oneLiner}</p>
          </div>

          <div style={{ position: "relative", width: 220, height: 210, flexShrink: 0 }}>
            <WorkTICharacterImage
              code={code}
              fallbackIcon={detail.characterIcon}
              size={210}
              frameless
              className="absolute inset-0 object-bottom"
            />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.7)",
                padding: "6px 14px",
                fontSize: 13,
                color: "#374151",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "24px 32px 28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            borderRadius: 12,
            background: "rgba(5,150,105,0.08)",
            border: "1px solid #d1fae5",
            padding: "12px 16px",
          }}
        >
          <span
            style={{
              display: "flex",
              width: 20,
              height: 20,
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              background: "#059669",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
              marginTop: 1,
            }}
          >
            ✓
          </span>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.6, color: "#065f46" }}>
            {detail.goodFitCompany.summary}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            ✦ WORK STYLE ✦
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {AXIS_ORDER.map((dimension) => (
              <ShareAxisCard key={dimension} dimension={dimension} axis={axes[dimension]} />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "14px 32px",
          borderTop: "1px solid #e5e7eb",
          fontSize: 12,
          color: "#9ca3af",
        }}
      >
        Workwity · Work-TI — 업무 성향 기반 채용 플랫폼
      </div>
    </div>
  );
});
