"use client";

import Link from "next/link";
import { trackAnalyticsEvent } from "@/lib/analytics/ga";

const OPTIONS = [
  {
    key: "seeker",
    title: "구직자로 테스트하기",
    description: "나의 일하는 방식을 확인하고, 잘 맞는 공고를 찾아보세요.",
    href: "/test",
  },
  {
    key: "company",
    title: "기업으로 테스트하기",
    description: "우리 팀이 실제로 일하는 방식을 등록하고, 지원자와의 궁합을 확인하세요.",
    href: "/company/onboarding",
  },
] as const;

/**
 * Entry point for both Work-TI questionnaires — picking a side here sends
 * the seeker path straight into the existing `/test` resume-redirect flow,
 * and the company path into the existing `/company/onboarding` flow. Neither
 * of those routes changes; this page only decides which one to enter.
 */
export default function TestStartPage() {
  return (
    <div className="mx-auto flex max-w-[860px] flex-col items-center gap-10 px-8 py-16 text-center md:py-24">
      <div className="flex flex-col items-center gap-3">
        <span className="text-code-sm text-primary-600">WORK-TI</span>
        <h1 className="text-heading-1 text-gray-950">Work-TI 테스트를 시작해 볼까요?</h1>
        <p className="max-w-[480px] text-body-md text-gray-600">
          누구의 입장에서 답할지 먼저 선택해 주세요. 3분이면 충분합니다.
        </p>
      </div>

      <div className="grid w-full gap-5 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <Link
            key={option.key}
            href={option.href}
            onClick={() => {
              if (option.key === "seeker") {
                trackAnalyticsEvent("workti_test_start", { user_role: "seeker" });
              }
            }}
            className="flex flex-col items-start gap-3 rounded-lg border border-gray-200 bg-white p-7 text-left shadow-xs transition-colors hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-none focus-visible:shadow-focus"
          >
            <h2 className="text-heading-3 text-gray-950">{option.title}</h2>
            <p className="text-body-sm leading-6 text-gray-600">{option.description}</p>
            <span className="mt-auto text-body-sm font-semibold text-primary-600">시작하기 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
