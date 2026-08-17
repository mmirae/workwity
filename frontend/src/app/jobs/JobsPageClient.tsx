"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WORK_TI_RESULTS } from "@/data/workti/worktiData";
import { MOCK_JOBS } from "@/lib/mock/jobs";
import {
  HIRING_PROCESS_FILTERS,
  getHiringProcessFilterLabel,
  resolveExclusiveFilters,
  type HiringProcessFilterId,
} from "@/data/hiringProcessFilters";
import { computeJobMatch } from "@/lib/workti/matchJob";
import { getStoredResult, type StoredWorkTIResult } from "@/lib/workti/testStorage";
import { JobCard } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/Button";

type SortKey = "match" | "recent";

const SORT_LABEL: Record<SortKey, string> = {
  match: "Match 높은 순",
  recent: "최신 등록 순",
};

export default function JobsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [userResult, setUserResult] = useState<StoredWorkTIResult | null | undefined>(undefined);
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getStoredResult();
    setUserResult(stored);
    setSortKey(stored ? "match" : "recent");
  }, []);

  useEffect(() => {
    if (!sortOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sortOpen]);

  const selectedStages = searchParams.getAll("stage");

  const toggleStage = (key: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("stage");
    const nextStages = selectedStages.includes(key)
      ? selectedStages.filter((s) => s !== key)
      : resolveExclusiveFilters([...selectedStages, key] as HiringProcessFilterId[]);
    nextStages.forEach((s) => next.append("stage", s));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const clearFilters = () => router.replace(pathname, { scroll: false });

  const jobsWithMatch = useMemo(
    () =>
      MOCK_JOBS.map((job) => ({
        job,
        matchPct: userResult ? computeJobMatch(userResult, job.companyScores).percentage : undefined,
      })),
    [userResult]
  );

  const filtered = jobsWithMatch.filter(({ job }) =>
    selectedStages.every((tag) => job.hiringProcessFilterIds.includes(tag as HiringProcessFilterId))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "match") return (b.matchPct ?? 0) - (a.matchPct ?? 0);
    return b.job.postedAt.localeCompare(a.job.postedAt);
  });

  const stageCounts = HIRING_PROCESS_FILTERS.reduce<Record<string, number>>((acc, filter) => {
    acc[filter.id] = MOCK_JOBS.filter((job) => job.hiringProcessFilterIds.includes(filter.id)).length;
    return acc;
  }, {});

  if (userResult === undefined) return null;

  const myDefinition = userResult ? WORK_TI_RESULTS[userResult.code] : null;

  return (
    <div className="mx-auto grid max-w-[1200px] items-start gap-6 px-8 py-8 md:grid-cols-[264px_1fr]">
      <aside className="flex flex-col gap-4 md:sticky md:top-22">
        {userResult && myDefinition ? (
          <div className="flex flex-col gap-2 rounded-lg bg-primary-100 p-5">
            <span className="text-code-sm text-primary-700">MY WORK-TI</span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-code-lg text-gray-950">{userResult.code}</span>
              <span className="text-body-sm font-semibold text-primary-800">{myDefinition.title}</span>
            </div>
            <Link href="/me" className="text-caption font-semibold text-primary-700 underline hover:text-primary-800">
              리포트 다시 보기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <span className="text-body-sm font-bold text-gray-950">아직 Work-TI를 안 하셨네요</span>
            <p className="text-caption leading-6 text-gray-500">
              테스트를 완료하면 공고별 Work Identity Match를 확인할 수 있어요
            </p>
            <Button variant="primary" size="sm" href="/test">
              3분 만에 알아보기
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-body-md font-bold text-gray-950">채용 전형 필터</span>
            {selectedStages.length > 0 && (
              <button type="button" onClick={clearFilters} className="text-caption font-semibold text-primary-600">
                초기화
              </button>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            {HIRING_PROCESS_FILTERS.map((filter) => {
              const checked = selectedStages.includes(filter.id);
              return (
                <label
                  key={filter.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md p-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleStage(filter.id)}
                    className="size-4 rounded border-gray-300 accent-primary-600"
                  />
                  <span className={checked ? "text-body-sm font-semibold text-gray-950" : "text-body-sm text-gray-700"}>
                    {filter.label}
                  </span>
                  <span className="ml-auto text-caption text-gray-400">{stageCounts[filter.id]}</span>
                </label>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-3.5">
            <span className="text-body-sm font-bold text-gray-950">직무 · 경력</span>
            <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2.5 text-body-sm text-gray-500">
              전체 직무 <span>▾</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2.5 text-body-sm text-gray-500">
              전체 경력 <span>▾</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-heading-3 text-gray-950">내게 맞는 공고</h1>
            <span className="text-body-sm text-gray-500">{sorted.length}개 공고</span>
          </div>
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((open) => !open)}
              className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-body-sm text-gray-700 hover:bg-gray-50"
            >
              {SORT_LABEL[sortKey]}
              <span className="text-gray-400">▾</span>
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-11 z-20 min-w-[176px] rounded-lg border border-gray-200 bg-white p-1.5 shadow-md">
                {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSortKey(key);
                      setSortOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-body-sm text-gray-900 hover:bg-gray-100"
                  >
                    {SORT_LABEL[key]}
                    {sortKey === key && <span className="text-primary-600">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {sorted.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sorted.map(({ job, matchPct }) => (
              <JobCard
                key={job.id}
                href={`/jobs/${job.id}`}
                company={job.company}
                companyInitial={job.companyInitial}
                title={job.title}
                tags={job.hiringProcessFilterIds.map(getHiringProcessFilterLabel)}
                matchPct={matchPct}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-gray-200 bg-white p-16">
            <span className="text-body-md font-bold text-gray-950">조건에 맞는 공고가 없습니다</span>
            <p className="text-center text-body-sm leading-6 text-gray-500">
              선택한 전형 조건을 하나 이상 해제하면
              <br />
              더 많은 공고를 볼 수 있습니다
            </p>
            <Button variant="primary" size="sm" onClick={clearFilters}>
              필터 초기화
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
