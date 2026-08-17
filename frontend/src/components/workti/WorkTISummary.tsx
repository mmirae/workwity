interface WorkTISummaryProps {
  text: string;
}

/**
 * Typography-only "WORK-TI SUMMARY" band, replacing the old Orbit chart
 * summary. Sits directly below AxisStyleGrid on both the seeker and company
 * reports. `text` is always a real Work-TI data field (`definition.description`
 * for both datasets) — never fabricated copy.
 */
export function WorkTISummary({ text }: WorkTISummaryProps) {
  return (
    <div className="flex flex-col items-center gap-4 border-y border-gray-200 py-10 text-center">
      <span className="text-code-sm text-primary-600">WORK-TI SUMMARY</span>
      <p className="max-w-[620px] text-heading-3 font-bold leading-8 text-gray-950">{text}</p>
    </div>
  );
}
