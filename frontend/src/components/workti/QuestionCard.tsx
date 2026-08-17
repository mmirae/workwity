"use client";

import { cn } from "@/lib/cn";

export interface QuestionCardOption {
  label: "A" | "B";
  text: string;
}

interface QuestionCardProps {
  /** e.g. "Q8 · 의사결정" */
  tag: string;
  question: string;
  /** Optional context line — used when the same card is reused for a company's "우리 팀" perspective. */
  perspectiveNote?: string;
  options: readonly [QuestionCardOption, QuestionCardOption];
  selectedLabel?: "A" | "B";
  onSelect: (label: "A" | "B") => void;
}

/**
 * One Work-TI dilemma question — reused by the job seeker test and (later)
 * the company onboarding test, since both answer the same 30 questions.
 */
export function QuestionCard({
  tag,
  question,
  perspectiveNote,
  options,
  selectedLabel,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="flex w-full max-w-[760px] flex-col items-center gap-4">
      <span className="text-code-sm text-primary-600">{tag}</span>
      <h2 className="max-w-[620px] text-center text-heading-3 leading-9 text-gray-950 sm:text-heading-2">
        {question}
      </h2>
      {perspectiveNote && <p className="text-body-sm text-gray-400">{perspectiveNote}</p>}

      <div className="mt-2 grid w-full gap-3.5 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedLabel === option.label;
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.label)}
              className={cn(
                "flex flex-col gap-2.5 rounded-md border p-6 text-left transition-colors duration-150",
                "focus-visible:outline-none focus-visible:shadow-focus",
                isSelected
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <span className="text-code-sm text-gray-400">{option.label}</span>
              <span className="text-body-md font-medium leading-7 text-gray-950">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
