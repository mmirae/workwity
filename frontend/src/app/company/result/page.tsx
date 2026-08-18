"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { COMPANY_WORK_TI_RESULTS } from "@/data/workti/companyWorktiData";
import { WORK_TI_RESULT_DETAILS } from "@/data/workti/worktiData";
import {
  getCompanyResultSnapshot,
  getCompanyStorageServerSnapshot,
  subscribeToCompanyStorage,
} from "@/lib/company/companyStorage";
import { ReportHero } from "@/components/workti/ReportHero";
import { AxisStyleGrid } from "@/components/workti/AxisStyleGrid";
import { WorkTISummary } from "@/components/workti/WorkTISummary";
import { SectionHeader } from "@/components/workti/SectionHeader";
import { FitSection } from "@/components/workti/FitSection";
import { CommunicationGrid } from "@/components/workti/CommunicationGrid";
import { StyleColumn } from "@/components/workti/StyleColumn";
import { NextAction } from "@/components/workti/NextAction";
import { Button } from "@/components/ui/Button";

export default function CompanyResultPage() {
  const router = useRouter();
  const result = useSyncExternalStore(
    subscribeToCompanyStorage,
    getCompanyResultSnapshot,
    getCompanyStorageServerSnapshot
  );

  useEffect(() => {
    // Read the snapshot directly here rather than depending on `result`:
    // effects only ever run after mount on the client, so this call is
    // always the real localStorage value — never the transient
    // `getServerSnapshot` (`null`) that `result` briefly holds during the
    // hydration render, right before useSyncExternalStore resyncs it.
    // Depending on `result` instead would fire this redirect on that
    // transient `null` before the resync happens.
    if (getCompanyResultSnapshot() === null) {
      router.replace("/company/onboarding");
    }
  }, [router]);

  if (!result) return null;

  const definition = COMPANY_WORK_TI_RESULTS[result.code];
  // 기업용 캐릭터를 새로 만들지 않고, 구직자/기업이 공유하는 16개 코드의
  // 기존 캐릭터 이미지(및 이미지 실패 시 폴백 이모지)를 그대로 재사용합니다.
  const characterFallbackIcon = WORK_TI_RESULT_DETAILS[result.code].characterIcon;

  const handleRetake = () => {
    router.push("/company/onboarding");
  };

  return (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-8 px-8 py-12">
      <ReportHero
        kicker="TEAM WORK-TI REPORT"
        code={result.code}
        title={definition.title}
        catchphrase={definition.catchphrase}
        tags={definition.tags}
        characterIcon={characterFallbackIcon}
        actions={
          <Button variant="secondary" size="sm" onClick={handleRetake}>
            재응답
          </Button>
        }
      />

      <AxisStyleGrid axes={result.axes} />
      <WorkTISummary text={definition.description} />

      <div className="flex flex-col gap-8">
        <SectionHeader eyebrow="SECTION 01" title="우리 팀의 업무 환경" />
        <div className="grid gap-6 sm:grid-cols-2">
          <StyleColumn label="업무 진행 방식" text={definition.workStyle} />
          <StyleColumn label="의사결정 방식" text={definition.decisionStyle} />
          <StyleColumn label="속도 · 품질 기준" text={definition.qualityStyle} />
          <StyleColumn label="성장 · 안정 환경" text={definition.growthStyle} />
        </div>
      </div>

      <FitSection
        eyebrow="SECTION 02 · FIT"
        title="이런 구성원이 잘 맞아요"
        summary={definition.goodFit}
        points={definition.goodFitPoints}
      />

      <div className="flex flex-col gap-5">
        <SectionHeader eyebrow="SECTION 03" title="함께 일할 때 체크할 점" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2.5 rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="flex items-center gap-1.5 text-body-md font-bold text-gray-950">
              <span aria-hidden="true">⚠️</span> 함께 일할 때 주의할 점
            </h3>
            <p className="text-body-sm leading-6 text-gray-600">{definition.caution}</p>
          </div>
          <div className="flex flex-col gap-2.5 rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="flex items-center gap-1.5 text-body-md font-bold text-gray-950">
              <span aria-hidden="true">🤝</span> 더 잘 맞춰 일하기 위한 팁
            </h3>
            <p className="text-body-sm leading-6 text-gray-600">{definition.collaborationTip}</p>
          </div>
        </div>
        <p className="text-caption leading-6 text-gray-400">
          이 결과는 조직이나 사람의 우열을 평가하지 않으며, 업무 방식의 차이를 설명하기 위한 참고 정보입니다.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <SectionHeader eyebrow="SECTION 04" title="우리 팀의 커뮤니케이션 문화" />
        <CommunicationGrid badges={result.bonusBadges} />
      </div>

      <NextAction
        description="이 Work-TI를 채용공고에 적용하면 구직자의 Work-TI와 비교한 업무환경 궁합을 보여줄 수 있습니다."
        primary={{ label: "이 Work-TI를 채용공고에 적용하기", href: "/company/mypage?tab=jobs" }}
        secondaryActions={[{ label: "테스트 다시 하기", href: "/company/onboarding" }]}
        textCta={{ label: "기업 마이페이지로 이동", href: "/company/mypage" }}
      />
    </div>
  );
}
