"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WORK_TI_RESULT_DETAILS, WORK_TI_RESULTS } from "@/data/workti/worktiData";
import { clearStoredAnswers, getStoredResult, type StoredWorkTIResult } from "@/lib/workti/testStorage";
import { WorkTIReportCard } from "@/components/workti/WorkTIReportCard";
import { WorkTIResultDetailSections } from "@/components/workti/WorkTIResultDetailSections";
import { WorkTIShareCard } from "@/components/workti/WorkTIShareCard";
import { SectionHeader } from "@/components/workti/SectionHeader";
import { NextAction } from "@/components/workti/NextAction";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

const RECOMMENDED_JOBS = [
  { title: "프로덕트 디자이너", company: "토스트랩", tags: ["코테 없음", "면접 1회"], matchPct: 92 },
  { title: "백엔드 엔지니어", company: "뉴런랩스", tags: ["코테 없음", "과제 전형"], matchPct: 87 },
];

export default function MyWorkTIPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredWorkTIResult | null | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getStoredResult();
    if (!stored) {
      router.replace("/test");
      return;
    }
    setResult(stored);
  }, [router]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const handleRetake = () => {
    clearStoredAnswers();
    router.push("/test");
  };

  const handleSaveImage = async () => {
    const node = shareCardRef.current;
    if (!node) return;

    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `workwity-workti-${result?.code ?? "result"}.png`;
      link.click();
      showToast("이미지가 저장되었습니다");
    } catch {
      showToast("이미지 저장에 실패했습니다. 다시 시도해 주세요");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("링크가 복사되었습니다");
    } catch {
      showToast("링크 복사에 실패했습니다");
    }
  };

  if (!result) return null;

  const definition = WORK_TI_RESULTS[result.code];
  const detail = WORK_TI_RESULT_DETAILS[result.code];

  return (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-8 px-8 py-12">
      <WorkTIReportCard
        code={result.code}
        definition={definition}
        axes={result.axes}
        characterIcon={detail.characterIcon}
        actions={
          <Button variant="secondary" size="sm" onClick={handleRetake}>
            테스트 다시 하기
          </Button>
        }
      />

      <WorkTIResultDetailSections detail={detail} bonusBadges={result.bonusBadges} />

      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            eyebrow="SECTION 05 · MATCH"
            title="나와 잘 맞는 회사의 공고"
            subtitle="내 Work-TI와 업무 환경이 잘 맞는 회사의 채용공고예요. 능력이나 합격 가능성이 아니라, 일하는 방식의 궁합을 보여줘요."
          />
          <Link
            href="/jobs"
            className="shrink-0 text-body-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            모두 보기 →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {RECOMMENDED_JOBS.map((job) => (
            <div
              key={job.title}
              className="flex items-center justify-between gap-4 rounded-md border border-gray-200 p-4.5"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-gray-500">{job.company}</span>
                  <span className="text-body-md font-bold text-gray-950">{job.title}</span>
                </div>
                <div className="flex gap-1.5">
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-sm border border-gray-200 px-2 py-0.5 text-caption text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5 rounded-md bg-primary-50 px-4 py-2.5">
                <span className="text-body-md font-extrabold text-primary-600">{job.matchPct}%</span>
                <span className="text-code-sm text-primary-600">MATCH</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NextAction
        description="내 결과를 공유하거나 이미지로 저장해 보세요"
        primary={{ label: "결과 공유하기", onClick: handleShare }}
        secondary={{ label: "이미지 저장하기", onClick: handleSaveImage }}
        textCta={{ label: "나와 잘 맞는 회사의 공고 더 보기 →", href: "/jobs" }}
      />

      <Toast message={toast} />

      {/* Off-screen (not display:none, so html-to-image can lay it out and rasterize it) capture target for "결과 이미지로 저장하기". */}
      <div style={{ position: "fixed", top: 0, left: -9999, pointerEvents: "none" }} aria-hidden="true">
        <WorkTIShareCard code={result.code} definition={definition} axes={result.axes} detail={detail} ref={shareCardRef} />
      </div>
    </div>
  );
}
