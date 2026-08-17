import type { BonusBadgeResult, WorkTIResultDetail } from "@/data/workti/worktiData";
import { SectionHeader } from "@/components/workti/SectionHeader";
import { FitSection } from "@/components/workti/FitSection";
import { CommunicationGrid } from "@/components/workti/CommunicationGrid";

interface WorkTIResultDetailSectionsProps {
  detail: WorkTIResultDetail;
  bonusBadges: BonusBadgeResult[];
}

function StyleColumn({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-2.5 border-t-2 border-gray-950 pt-4">
      <span className="text-body-sm font-bold text-gray-950">{label}</span>
      <p className="text-body-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}

/**
 * Narrative result sections shown below WorkTIReportCard on /me — built from
 * WORK_TI_RESULT_DETAILS + the seeker's real 6 bonusBadges so the report
 * reads like a full culture-fit breakdown instead of a single catchphrase.
 */
export function WorkTIResultDetailSections({ detail, bonusBadges }: WorkTIResultDetailSectionsProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <SectionHeader eyebrow="SECTION 01" title="일하는 환경 & 가치관" />

        <div className="flex flex-col gap-2.5">
          <h3 className="text-body-sm font-bold text-gray-950">나는 어떤 환경에서 가장 잘 일하는가</h3>
          <blockquote className="rounded-md bg-primary-50 p-5 text-body-md font-medium leading-7 text-primary-800">
            &ldquo;{detail.heroQuote}&rdquo;
          </blockquote>
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-body-sm font-bold text-gray-950">내가 중요하게 생각하는 일의 가치</h3>
          <div className="flex flex-wrap gap-2">
            {detail.coreValues.map((value) => (
              <span
                key={value}
                className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-body-sm text-gray-700"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <FitSection
        eyebrow="SECTION 02 · FIT"
        title="이런 회사가 잘 맞아요"
        summary={detail.goodFitCompany.summary}
        points={detail.goodFitCompany.points}
      />

      <div className="flex flex-col gap-8">
        <SectionHeader eyebrow="SECTION 03" title="나의 업무 스타일" />
        <div className="grid gap-6 sm:grid-cols-3">
          <StyleColumn label="커리어 & 몰입 방식" text={detail.workLifeStyle} />
          <StyleColumn label="리더십 & 협업" text={detail.leadershipStyle} />
          <StyleColumn label="커뮤니케이션" text={detail.communicationStyle} />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-caption font-semibold text-gray-400">나의 커뮤니케이션 성향</span>
          <CommunicationGrid badges={bonusBadges} />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <SectionHeader eyebrow="SECTION 04" title="성장 & 스트레스 포인트" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2.5 rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="flex items-center gap-1.5 text-body-md font-bold text-gray-950">
              <span aria-hidden="true">🔥</span> 스트레스 받을 때
            </h3>
            <p className="text-body-sm leading-6 text-gray-600">{detail.stressTrigger}</p>
          </div>
          <div className="flex flex-col gap-2.5 rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="flex items-center gap-1.5 text-body-md font-bold text-gray-950">
              <span aria-hidden="true">💡</span> 2% 더 성장하기 위한 팁
            </h3>
            <p className="text-body-sm leading-6 text-gray-600">{detail.growthTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
