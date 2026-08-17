import { cn } from "@/lib/cn";

interface ProgressBarProps {
  /** Current step, 1-indexed (e.g. 8 of 27). */
  current: number;
  total: number;
  label?: string;
  className?: string;
}

/**
 * Thin linear progress bar used by the Work-TI test flow (and reusable
 * anywhere a step count needs to be shown, e.g. company onboarding).
 */
export function ProgressBar({ current, total, label, className }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100"
      >
        <div
          className="h-full rounded-full bg-primary-600 transition-[width] duration-200"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-code-sm text-gray-500 whitespace-nowrap">
        {label ?? `${current} / ${total}`}
      </span>
    </div>
  );
}
