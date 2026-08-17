import type { ReactNode } from "react";
import type { WorkTICode } from "@/data/workti/worktiData";
import { WorkTICharacterImage } from "@/components/workti/WorkTICharacterImage";

interface ReportHeroProps {
  /** "WORK IDENTITY REPORT" (seeker) or "TEAM WORK-TI REPORT" (company). */
  kicker: string;
  code: WorkTICode;
  title: string;
  catchphrase: string;
  tags: readonly string[];
  characterIcon: string;
  /** Page-specific buttons (e.g. "테스트 다시 하기"), rendered in the header band. */
  actions?: ReactNode;
}

/**
 * Shared Hero band for both the seeker (/me) and company (/company/result)
 * Work-TI reports — huge mono CODE, title, catchphrase, tags, and the shared
 * 16-code character illustration. Intentionally has no description/oneLiner
 * slot: that content lives in WorkTISummary directly below this.
 */
export function ReportHero({ kicker, code, title, catchphrase, tags, characterIcon, actions }: ReportHeroProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="flex items-center justify-between px-8 pt-8 sm:px-10">
        <span className="text-code-sm text-primary-700">{kicker}</span>
        {actions && <div className="flex shrink-0 gap-2.5">{actions}</div>}
      </div>

      <div className="flex flex-col gap-8 px-8 pb-8 pt-6 sm:min-h-[340px] sm:flex-row sm:items-stretch sm:gap-6 sm:px-10 sm:pb-0 sm:pt-4">
        <div className="flex flex-col justify-center gap-4 sm:w-[57%] sm:shrink-0 sm:pb-10">
          <div className="flex flex-col gap-0.5">
            {/*
              Typography color hierarchy: code (brand blue) reads first, then
              the type title (darkest neutral gray), then the catchphrase
              quote below (also darkest neutral — distinguished from the
              title by size/weight/quotation marks, not color) so "code →
              title → catchphrase" is the unambiguous reading order.
            */}
            <span className="font-mono text-display-xl leading-none tracking-tight text-primary-600">{code}</span>
            <span className="text-heading-1 text-gray-950">{title}</span>
          </div>
          <p className="max-w-[460px] text-heading-3 font-bold leading-8 text-gray-950">
            &ldquo;{catchphrase}&rdquo;
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/60 bg-white/70 px-3.5 py-1.5 text-body-sm text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/*
          Frameless hero illustration — object-contain only (never cropped or
          stretched; source art isn't uniformly square). `items-end` +
          `object-bottom` keep the character's own base anchored to the
          hero's floor regardless of its PNG's native aspect ratio.
        */}
        <div className="flex justify-center sm:w-[43%] sm:shrink-0 sm:items-end sm:justify-center">
          <div className="relative h-[220px] w-full max-w-[300px] sm:h-[320px] sm:max-w-[400px]">
            <WorkTICharacterImage
              code={code}
              fallbackIcon={characterIcon}
              size={320}
              frameless
              className="absolute inset-0 object-bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
