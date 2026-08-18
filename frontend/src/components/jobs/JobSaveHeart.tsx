"use client";

import { useEffect, useState } from "react";
import { isJobSaved, toggleSavedJob } from "@/lib/jobs/savedJobsStorage";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface JobSaveHeartProps {
  jobId: string;
  /** Called before the save is toggled — use to stop propagation when nested inside a link. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function JobSaveHeart({ jobId, onClick }: JobSaveHeartProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isJobSaved(jobId));
  }, [jobId]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setSaved(toggleSavedJob(jobId).includes(jobId));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "공고 저장 취소" : "공고 저장"}
      className={
        saved
          ? "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-danger-600 transition-colors hover:bg-gray-100"
          : "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-400"
      }
    >
      <HeartIcon filled={saved} />
    </button>
  );
}
