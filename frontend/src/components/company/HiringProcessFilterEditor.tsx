"use client";

import { useEffect, useRef, useState } from "react";
import {
  HIRING_PROCESS_FILTERS,
  resolveExclusiveFilters,
  type HiringProcessFilterId,
} from "@/data/hiringProcessFilters";
import { FilterInfoTooltip } from "@/components/ui/FilterInfoTooltip";

interface HiringProcessFilterEditorProps {
  value: HiringProcessFilterId[];
  onChange: (next: HiringProcessFilterId[]) => void;
}

/**
 * Chip editor for the official 13 hiring-process filters (Design §12-14).
 * Only ids from HIRING_PROCESS_FILTERS can be added — no free-text tags —
 * and adding a value auto-drops any conflicting value from the same
 * HIRING_FILTER_EXCLUSIVE_GROUPS group.
 */
export function HiringProcessFilterEditor({ value, onChange }: HiringProcessFilterEditorProps) {
  const [addOpen, setAddOpen] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!addOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (addRef.current && !addRef.current.contains(event.target as Node)) setAddOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [addOpen]);

  const removeFilter = (id: HiringProcessFilterId) => {
    onChange(value.filter((v) => v !== id));
  };

  const addFilter = (id: HiringProcessFilterId) => {
    onChange(resolveExclusiveFilters([...value.filter((v) => v !== id), id]));
    setAddOpen(false);
  };

  const availableToAdd = HIRING_PROCESS_FILTERS.filter((filter) => !value.includes(filter.id));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {value.length === 0 && <span className="text-caption text-gray-400">추출된 채용절차가 없습니다</span>}

      {value.map((id) => {
        const filter = HIRING_PROCESS_FILTERS.find((f) => f.id === id);
        if (!filter) return null;
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-100 px-3.5 py-1.5 text-body-sm font-medium text-primary-700"
          >
            {filter.label}
            <FilterInfoTooltip description={filter.description} />
            <button
              type="button"
              aria-label={`${filter.label} 삭제`}
              onClick={() => removeFilter(id)}
              className="text-primary-600 hover:text-primary-800"
            >
              ×
            </button>
          </span>
        );
      })}

      <div className="relative" ref={addRef}>
        <button
          type="button"
          onClick={() => setAddOpen((v) => !v)}
          className="rounded-full border border-dashed border-gray-300 px-3.5 py-1.5 text-body-sm text-gray-500 hover:border-gray-400 hover:text-gray-700"
        >
          + 채용절차 추가
        </button>
        {addOpen && (
          <div className="absolute left-0 top-9 z-20 max-h-64 w-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-md">
            {availableToAdd.length === 0 ? (
              <span className="block px-2 py-1.5 text-caption text-gray-400">추가할 수 있는 전형이 없습니다</span>
            ) : (
              availableToAdd.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => addFilter(filter.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-body-sm text-gray-700 hover:bg-gray-50"
                >
                  <span>{filter.label}</span>
                  <FilterInfoTooltip description={filter.description} />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
