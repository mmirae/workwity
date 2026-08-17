import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  selected?: boolean;
  className?: string;
  children: ReactNode;
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M3.5 8.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Filter chip — Design System §11. Toggle affordance for job-stage filters
 * (e.g. "코딩테스트 없음"). Always a real <button> so it's keyboard operable.
 */
export function Chip({ selected = false, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 py-2 text-body-sm font-medium transition-colors duration-150",
        "focus-visible:outline-none focus-visible:shadow-focus",
        selected
          ? "border-primary-100 bg-primary-100 text-primary-700"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        className
      )}
      {...rest}
    >
      {selected && <CheckIcon />}
      {children}
    </button>
  );
}
