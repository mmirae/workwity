"use client";

import { useEffect, useRef, useState } from "react";

/** Small "i" affordance that reveals a filter's description on click — used next to hiring-process tags whose meaning isn't self-evident (e.g. 커피챗). */
export function FilterInfoTooltip({ description }: { description: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative inline-flex shrink-0" ref={ref}>
      <button
        type="button"
        aria-label="설명 보기"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="flex size-4 items-center justify-center rounded-full border border-gray-300 text-[10px] font-bold leading-none text-gray-400 hover:border-gray-400 hover:text-gray-600"
      >
        i
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute left-1/2 top-6 z-30 w-56 -translate-x-1/2 rounded-md border border-gray-200 bg-white p-3 text-caption leading-5 text-gray-600 shadow-md"
        >
          {description}
        </div>
      )}
    </div>
  );
}
