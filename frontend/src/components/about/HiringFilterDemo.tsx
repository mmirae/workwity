"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";

interface DemoJob {
  title: string;
  company: string;
  tags: string[];
}

const FILTER_LABELS = [
  "코딩테스트 없음",
  "과제 없음",
  "면접 1회",
  "포트폴리오",
  "화상 면접",
  "대면 면접",
  "인적성 없음",
];

// Small, page-local demo dataset — intentionally separate from the real
// job listings mock data used on /jobs, since this is just an illustration.
const DEMO_JOBS: DemoJob[] = [
  { title: "프로덕트 디자이너", company: "모먼트랩", tags: ["코딩테스트 없음", "포트폴리오", "면접 1회"] },
  { title: "백엔드 엔지니어", company: "플로우웍스", tags: ["과제 없음", "화상 면접"] },
  { title: "마케터", company: "브라이트랩", tags: ["코딩테스트 없음", "대면 면접", "인적성 없음"] },
  { title: "프론트엔드 개발자", company: "스튜디오웨이", tags: ["포트폴리오", "화상 면접", "면접 1회"] },
  { title: "세일즈 매니저", company: "블루오션웍스", tags: ["코딩테스트 없음", "과제 없음", "인적성 없음"] },
  { title: "UX 리서처", company: "메이플크루", tags: ["포트폴리오", "대면 면접"] },
  { title: "데이터 분석가", company: "루틴웍스", tags: ["코딩테스트 없음", "화상 면접", "면접 1회"] },
  { title: "HR 파트너", company: "노스필드", tags: ["과제 없음", "대면 면접", "인적성 없음"] },
];

/**
 * Real, client-side-only demo for the "채용 전형도 직접 고릅니다" pitch — not a
 * static mockup. Selecting multiple chips ANDs the conditions together
 * (a job must match every selected tag), mirroring how the real job filter
 * would behave.
 */
export function HiringFilterDemo() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) => {
    setSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  };

  const clearFilters = () => setSelected([]);

  const filteredJobs = DEMO_JOBS.filter((job) => selected.every((label) => job.tags.includes(label)));

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-7 md:p-9">
      <div className="mb-4 text-body-sm font-bold text-gray-700">원하는 전형만 골라보세요.</div>
      <div className="mb-7 flex flex-wrap gap-2.5">
        {FILTER_LABELS.map((label) => (
          <Chip key={label} selected={selected.includes(label)} onClick={() => toggle(label)}>
            {label}
          </Chip>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between">
        <p className="text-body-sm text-gray-500">
          조건에 맞는 공고 <strong className="font-bold text-primary-600">{filteredJobs.length}</strong>개
        </p>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-caption text-gray-500 underline underline-offset-2 hover:text-gray-700 focus-visible:outline-none focus-visible:shadow-focus"
          >
            필터 초기화
          </button>
        )}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="py-12 text-center text-body-sm text-gray-500">
          선택한 조건에 맞는 공고가 아직 없어요. 필터를 조정해보세요.
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2">
          {filteredJobs.map((job) => (
            <div key={`${job.company}-${job.title}`} className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-5.5">
              <div>
                <p className="text-body-md font-bold text-gray-950">{job.title}</p>
                <p className="text-caption text-gray-500">{job.company}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-caption font-semibold text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
