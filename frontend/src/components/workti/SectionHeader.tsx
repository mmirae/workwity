interface SectionHeaderProps {
  /** e.g. "SECTION 01" or "SECTION 02 · FIT". */
  eyebrow: string;
  title: string;
  subtitle?: string;
}

/** Shared "SECTION 0N" heading used by every result-page section on both reports. */
export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-code-sm text-primary-600">{eyebrow}</span>
      <h2 className="text-heading-3 text-gray-950">{title}</h2>
      {subtitle && <p className="text-body-sm leading-6 text-gray-500">{subtitle}</p>}
    </div>
  );
}
