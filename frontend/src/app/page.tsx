import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LandingLoginButton } from "@/components/landing/LandingLoginButton";
import { CompassIcon, OverlapCirclesIcon, TimerIcon } from "@/components/landing/icons";

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
            <span className="size-1.5 rounded-full bg-primary-600" />
            Work-TI · 3분이면 충분합니다
          </span>
          <h1 className="max-w-[760px] text-display-xl text-gray-950">
            나에게 딱 맞는 회사 찾기,
            <br />
            <span className="text-primary-600">Work with Identity.</span>
          </h1>
          <p className="max-w-[560px] text-body-lg text-gray-600">
            구직자와 기업이 함께 Work-TI를 진행하고, 서로의 일하는 방식이 얼마나 맞는지 확인합니다. 능력을 평가하지
            않습니다.
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="lg" href="/test/start">
              3분 만에 내 Work-TI 알아보기 →
            </Button>
            <LandingLoginButton />
          </div>
          <span className="text-caption text-gray-500">회원가입 없이 바로 시작 · 결과 저장 시에만 로그인</span>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-11 px-8 py-14 md:py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-code-sm text-primary-600">HOW IT WORKS</span>
          <h2 className="text-heading-2 text-gray-950">Work-TI란 무엇인가요?</h2>
          <p className="max-w-[520px] text-body-md text-gray-600">
            업무 능력을 평가하는 테스트가 아닙니다. 서로의 일하는 방식을 이해하기 위한 공통 언어입니다.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} variant="base" className="flex flex-col gap-3.5">
              <div className="flex size-11 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                {feature.icon}
              </div>
              <h3 className="text-heading-3 text-gray-950">{feature.title}</h3>
              <p className="text-body-sm text-gray-600">{feature.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Work Identity Match */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-8 py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col gap-4">
            <span className="text-code-sm text-primary-600">WORK IDENTITY MATCH</span>
            <h2 className="text-heading-2 text-gray-950">
              맞는 회사인지,
              <br />
              지원하기 전에 압니다
            </h2>
            <p className="text-body-md text-gray-600">
              구직자의 Work-TI와 기업 팀의 Work-TI를 4개 축으로 비교해 Match를 계산합니다. 원하는 채용 전형으로
              공고를 걸러낼 수도 있습니다.
            </p>
            <ul className="mt-1 flex flex-col gap-2.5">
              {MATCH_CHECKLIST.map((item) => (
                <CheckBullet key={item}>{item}</CheckBullet>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3.5 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <MatchPreviewCard
              company="토스트랩"
              title="프로덕트 디자이너"
              tags={["코테 없음", "면접 1회"]}
              matchPercentage={92}
              emphasized
            />
            <MatchPreviewCard
              company="뉴런랩스"
              title="UX 디자이너"
              tags={["과제 전형"]}
              matchPercentage={74}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-8 py-20 text-center md:py-24">
        <h2 className="text-heading-2 text-gray-950">3분이면, 나에게 맞는 회사가 보입니다</h2>
        <Button variant="primary" size="lg" href="/test/start">
          Work-TI 테스트 시작하기 →
        </Button>
      </section>
    </>
  );
}
