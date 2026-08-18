interface StyleColumnProps {
  label: string;
  text: string;
}

/**
 * Divided label + body column — the seeker's "나의 업무 스타일" (3-up) and the
 * company's "우리 팀의 업무 환경" (2×2) are the same visual unit, just a
 * different grid arity, so both reuse this instead of keeping parallel
 * near-duplicate implementations.
 */
export function StyleColumn({ label, text }: StyleColumnProps) {
  return (
    <div className="flex flex-col gap-2.5 border-t-2 border-gray-950 pt-4">
      <span className="text-body-sm font-bold text-gray-950">{label}</span>
      <p className="text-body-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}
