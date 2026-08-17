import Link from "next/link";

export interface JobCardProps {
  href: string;
  company: string;
  companyInitial: string;
  title: string;
  tags: string[];
  /** undefined when the viewer hasn't taken Work-TI yet — badge is omitted, not zeroed. */
  matchPct?: number;
}

export function JobCard({ href, company, companyInitial, title, tags, matchPct }: JobCardProps) {
  return (
    <Link
      href={href}
      className="grid grid-cols-[1fr_auto] items-center gap-5 rounded-lg border border-gray-200 bg-white p-6 shadow-xs transition-all duration-150 hover:border-gray-300 hover:shadow-sm"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7.5 items-center justify-center rounded-md bg-primary-100 text-caption font-extrabold text-primary-600">
            {companyInitial}
          </span>
          <span className="text-body-sm text-gray-500">{company}</span>
        </div>
        <span className="text-body-lg font-bold text-gray-950">{title}</span>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-sm border border-gray-200 bg-gray-50 px-2.5 py-1 text-caption text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {matchPct != null && (
        <div className="flex flex-col items-center gap-0.5 rounded-md bg-primary-50 px-4 py-3">
          <span className="text-heading-3 text-primary-600">{matchPct}%</span>
          <span className="text-code-sm text-primary-600">MATCH</span>
        </div>
      )}
    </Link>
  );
}
