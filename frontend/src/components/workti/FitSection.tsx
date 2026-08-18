import { SectionHeader } from "@/components/workti/SectionHeader";

interface FitSectionProps {
  eyebrow: string;
  title: string;
  summary: string;
  /** Omit for datasets that only have a single summary sentence, no bullet breakdown. */
  points?: readonly string[];
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * "이런 회사가 잘 맞아요" (seeker) / "이런 구성원이 잘 맞아요" (company) — a
 * light green accent, but deliberately not a heavy filled "success" card:
 * white background with a thin border, so it reads as a fit description
 * rather than a pass/fail confirmation.
 */
export function FitSection({ eyebrow, title, summary, points }: FitSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div className="flex flex-col gap-5 rounded-lg border border-success-100 bg-white p-7">
        <p className="text-body-lg font-bold leading-7 text-success-700">{summary}</p>
        {points && points.length > 0 && (
          <>
            <div className="h-px bg-success-100" aria-hidden="true" />
            <ul className="flex flex-col gap-3">
              {points.map((point) => (
                <li key={point} className="flex gap-2.5 text-body-sm leading-6 text-gray-700">
                  <span
                    className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-success-600"
                    aria-hidden="true"
                  >
                    <CheckIcon />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
