"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WORK_TI_RESULT_DETAILS, WORK_TI_RESULTS } from "@/data/workti/worktiData";
import { clearStoredAnswers, getStoredResult, type StoredWorkTIResult } from "@/lib/workti/testStorage";
import { trackAnalyticsEvent } from "@/lib/analytics/ga";
import { WorkTIReportCard } from "@/components/workti/WorkTIReportCard";
import { WorkTIResultDetailSections } from "@/components/workti/WorkTIResultDetailSections";
import { WorkTIShareCard } from "@/components/workti/WorkTIShareCard";
import { NextAction } from "@/components/workti/NextAction";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

export default function MyWorkTIPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredWorkTIResult | null | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const viewedResultCodeRef = useRef<string | null>(null);

  useEffect(() => {
    const stored = getStoredResult();
    if (!stored) {
      router.replace("/test");
      return;
    }
    // localStorage is available only after hydration, so synchronize its snapshot here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(stored);
    if (viewedResultCodeRef.current !== stored.code) {
      viewedResultCodeRef.current = stored.code;
      trackAnalyticsEvent("workti_result_view", {
        user_role: "seeker",
        workti_type: stored.code,
      });
    }
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

      <NextAction
        eyebrow="NEXT STEP"
        title="나와 맞는 회사를 찾아보세요."
        description="Work-TI 결과를 바탕으로 나와 일하는 방식이 잘 맞는 회사의 공고를 확인해보세요."
        primary={{ label: "나와 잘 맞는 공고 보기 →", href: "/jobs" }}
        secondaryActions={[
          { label: "결과 공유하기", onClick: handleShare },
          { label: "이미지 저장하기", onClick: handleSaveImage },
        ]}
        textCta={{ label: "다른 Work-TI 유형 둘러보기", href: "/work-ti" }}
      />

      <Toast message={toast} />

      {/* Off-screen (not display:none, so html-to-image can lay it out and rasterize it) capture target for "결과 이미지로 저장하기". */}
      <div style={{ position: "fixed", top: 0, left: -9999, pointerEvents: "none" }} aria-hidden="true">
        <WorkTIShareCard code={result.code} definition={definition} axes={result.axes} detail={detail} ref={shareCardRef} />
      </div>
    </div>
  );
}
