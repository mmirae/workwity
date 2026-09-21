import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LandingLoginButton } from "@/components/landing/LandingLoginButton";
import { CompassIcon, OverlapCirclesIcon, TimerIcon } from "@/components/landing/icons";
import { WorkTISection } from "@/components/about/WorkTISection";
import { WorkIdentitySection } from "@/components/about/WorkIdentitySection";
import { AIJobAnalysisSection } from "@/components/landing/AIJobAnalysisSection";

const FEATURES = [
  {
    icon: <TimerIcon />,
    title: "3분, 30개 문항",
    body: "24개의 업무 성향 딜레마 질문과 6개의 조직 언어 질문에 답하면 나의 일하는 방식을 확인할 수 있습니다.",
  },
  {
    icon: <CompassIcon />,
    title: "Work Compass, 4개 축",
    body: "실행 스타일 · 의사결정 · 속도·디테일 · 가치 지향, 4개 축으로 당신이 편안하게 일하는 방향을 보여줍니다.",
  },
  {
    icon: <OverlapCirclesIcon />,
    title: "평가가 아닌 이해",
    body: "능력이나 합격 가능성을 판정하지 않습니다. 구직자와 기업이 서로의 일하는 방식을 이해하는 공통 언어입니다.",
  },
];

const MATCH_CHECKLIST = [
  "코딩테스트 없는 공고만 보기",
  "과제 · 면접 횟수로 필터링",
  "AI가 공고에서 전형을 자동 추출",
];

function CheckBullet({ children }: { children: string }) {
  return (
    <li className="flex items-center gap-2.5 text-body-md text-gray-950">
      <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 text-success-600">
        <path
          d="M4.5 10.5l3.2 3.2L15.5 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </li>
  );
}

function MatchPreviewCard({
  company,
  title,
  tags,
  matchPercentage,
  emphasized,
}: {
  company: string;
  title: string;
  tags: string[];
  matchPercentage: number;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="size-7 rounded-md bg-gray-100" aria-hidden="true" />
          <span className="text-body-sm text-gray-500">{company}</span>
        </div>
        <span className="text-body-md font-bold text-gray-950">{title}</span>
        <div className="flex gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-sm border border-gray-200 px-2 py-0.5 text-caption text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div
        className={
          emphasized
            ? "flex flex-col items-center gap-0.5 rounded-md bg-primary-50 px-4 py-3"
            : "flex flex-col items-center gap-0.5 rounded-md bg-gray-50 px-4 py-3"
        }
      >
        <span className={emphasized ? "text-heading-3 text-primary-600" : "text-heading-3 text-gray-600"}>
          {matchPercentage}%
        </span>
        <span className={emphasized ? "text-code-sm text-primary-600" : "text-code-sm text-gray-500"}>MATCH</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-8 py-18 text-center md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3.5 py-1.5 text-body-sm font-semibold text-primary-600">
            Work-TI × AI 채용공고 분석
          </span>
          <h1 className="max-w-[760px] text-display-xl text-gray-950">
            채용 방식부터, 일하는 방식까지.
            <br />
            <span className="text-primary-600">나와 맞는 회사를 찾아보세요.</span>
          </h1>
          <p className="max-w-[560px] text-body-lg text-gray-600">
            Work-TI로 나의 업무 성향을 알아보고,
            <br />
            AI로 채용공고를 분석해 나와 맞는 업무 환경인지 확인해보세요.
          </p>
          <div className="mt-1 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Button variant="primary" size="lg" href="/test/start" className="w-full sm:w-auto">
              내 Work-TI 알아보기
            </Button>
            <Button variant="secondary" size="lg" href="/job-analysis" className="w-full sm:w-auto">
              AI 공고 분석하기
            </Button>
          </div>
          <span className="text-caption text-gray-500">30문항, 약 3분 소요</span>
        </div>
      </section>

      {/* How it works */}
      <WorkTISection />

      {/* AI job analysis */}
      <AIJobAnalysisSection />

      {/* Work Identity */}
      <WorkIdentitySection />

      {/* Final CTA */}
      <section className="bg-gray-50">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-8 py-20 text-center md:py-24">
          <h2 className="text-heading-2 text-gray-950">채용의 새로운 시작, 워크위티</h2>
          <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Button variant="primary" size="lg" href="/test/start" className="w-full sm:w-auto">
              내 Work-TI 알아보기
            </Button>
            <Button variant="secondary" size="lg" href="/job-analysis" className="w-full sm:w-auto">
              AI 공고 분석하기
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
