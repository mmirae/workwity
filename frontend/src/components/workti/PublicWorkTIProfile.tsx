import Link from "next/link";
import {
  WORK_TI_RESULT_DETAILS,
  WORK_TI_RESULTS,
  type MainTraitCode,
  type WorkTICode,
} from "@/data/workti/worktiData";
import { Button } from "@/components/ui/Button";
import { FitSection } from "@/components/workti/FitSection";
import { SectionHeader } from "@/components/workti/SectionHeader";
import { StyleColumn } from "@/components/workti/StyleColumn";
import { WorkTICharacterImage } from "@/components/workti/WorkTICharacterImage";
import { cn } from "@/lib/cn";

interface PublicWorkTIProfileProps {
  code: WorkTICode;
}

interface TraitMeta {
  word: string;
  label: string;
  description: string;
}

const TRAIT_META: Record<MainTraitCode, TraitMeta> = {
  S: { word: "Seed", label: "가설실행형", description: "가설을 빠르게 실행하고 피드백으로 구체화합니다." },
  L: { word: "Leaf", label: "리서치분석형", description: "충분한 데이터와 계획을 바탕으로 실행합니다." },
  E: { word: "sElf", label: "자율주도형", description: "목표와 맥락 안에서 스스로 판단하고 움직입니다." },
  Y: { word: "sYstem", label: "체계합의형", description: "명확한 규칙과 팀의 합의를 기반으로 결정합니다." },
  M: { word: "Minimum", label: "스피드/린", description: "핵심 결과를 빠르게 만들고 반복해서 개선합니다." },
  D: { word: "Detail", label: "완벽주의형", description: "오류와 예외까지 살피며 높은 완성도를 추구합니다." },
  G: { word: "Growth", label: "성장모험형", description: "변화와 도전에서 성장의 동력을 얻습니다." },
  A: { word: "stAbility", label: "안정조화형", description: "지속 가능한 속도와 예측 가능한 환경을 중시합니다." },
};

const AXIS_META = [
  {
    number: "01",
    name: "EXECUTION STYLE",
    label: "실행 스타일",
    accent: "text-primary-600",
    surface: "bg-primary-50",
    border: "border-primary-600",
  },
  {
    number: "02",
    name: "DECISION MAKING",
    label: "의사결정",
    accent: "text-teal-600",
    surface: "bg-teal-100",
    border: "border-teal-600",
  },
  {
    number: "03",
    name: "SPEED & QUALITY",
    label: "속도와 품질",
    accent: "text-violet-600",
    surface: "bg-violet-100",
    border: "border-violet-600",
  },
  {
    number: "04",
    name: "VALUE ORIENTATION",
    label: "가치 지향",
    accent: "text-coral-600",
    surface: "bg-coral-100",
    border: "border-coral-600",
  },
] as const;

const OPPOSITE_TRAIT: Record<MainTraitCode, MainTraitCode> = {
  S: "L",
  L: "S",
  E: "Y",
  Y: "E",
  M: "D",
  D: "M",
  G: "A",
  A: "G",
};

function getNeighborCodes(code: WorkTICode): WorkTICode[] {
  return Array.from({ length: 4 }, (_, index) => {
    const characters = code.split("") as MainTraitCode[];
    characters[index] = OPPOSITE_TRAIT[characters[index]];
    return characters.join("") as WorkTICode;
  });
}

function PublicTypeHero({ code }: { code: WorkTICode }) {
  const definition = WORK_TI_RESULTS[code];
  const detail = WORK_TI_RESULT_DETAILS[code];

  return (
    <section className="overflow-hidden rounded-xl bg-primary-50">
      <div className="grid items-center gap-8 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1.08fr_0.92fr] md:gap-10 lg:min-h-[440px] lg:px-14">
        <div>
          <p className="text-code-sm text-primary-700">PUBLIC WORK-TI GUIDE</p>
          <p className="mt-5 font-mono text-[54px] leading-none font-bold tracking-tight text-primary-600 sm:text-[72px]">
            {code}
          </p>
          <h1 className="mt-2 text-heading-1 text-gray-950">{definition.title}</h1>
          <p className="mt-4 max-w-[560px] text-heading-3 font-bold text-gray-950">{detail.oneLiner}</p>
          <p className="mt-4 max-w-[560px] text-body-md text-gray-600">{definition.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {definition.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white bg-white/75 px-3.5 py-1.5 text-body-sm text-gray-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex min-h-[260px] items-center justify-center md:min-h-[360px]">
          <div className="h-[260px] w-full max-w-[360px] sm:h-[320px] md:h-[380px] md:max-w-[440px]">
            <WorkTICharacterImage
              code={code}
              fallbackIcon={detail.characterIcon}
              size={360}
              frameless
              alt={`${definition.title} ${code} 캐릭터`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FixedAxes({ code }: { code: WorkTICode }) {
  return (
    <section className="flex flex-col gap-5">
      <SectionHeader
        eyebrow="TYPE COMPOSITION"
        title={`${code}를 구성하는 4개의 축`}
        subtitle="이 공개 유형 페이지는 네 글자의 고정된 성향 조합을 설명하며, 개인별 강도나 퍼센트는 포함하지 않습니다."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {AXIS_META.map((axis, index) => {
          const traitCode = code[index] as MainTraitCode;
          const trait = TRAIT_META[traitCode];

          return (
            <article
              key={axis.name}
              className={cn("border-t-[3px] p-5 sm:p-6", axis.surface, axis.border)}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={cn("text-code-sm", axis.accent)}>
                    {axis.number} · {axis.name}
                  </p>
                  <p className="mt-1 text-body-sm font-semibold text-gray-700">{axis.label}</p>
                </div>
                <span className={cn("font-mono text-[56px] leading-none font-bold", axis.accent)} aria-hidden="true">
                  {traitCode}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className={cn("text-code-lg", axis.accent)}>{trait.word}</span>
                <h3 className="text-body-lg font-bold text-gray-950">{trait.label}</h3>
              </div>
              <p className="mt-2 text-body-sm leading-6 text-gray-600">{trait.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function OtherTypes({ code }: { code: WorkTICode }) {
  const neighbors = getNeighborCodes(code);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="EXPLORE MORE"
          title="다른 Work-TI 유형 보기"
          subtitle="한 축만 다른 유형을 비교하면 각 글자의 차이를 더 쉽게 이해할 수 있습니다."
        />
        <Link href="/work-ti" className="shrink-0 text-body-sm font-bold text-primary-700 hover:text-primary-800">
          16개 유형 전체 보기 →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {neighbors.map((neighborCode) => {
          const definition = WORK_TI_RESULTS[neighborCode];
          const detail = WORK_TI_RESULT_DETAILS[neighborCode];

          return (
            <Link
              key={neighborCode}
              href={`/work-ti/${neighborCode}`}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-sm focus-visible:outline-none focus-visible:shadow-focus"
            >
              <div className="flex h-36 items-center justify-center bg-primary-50 p-2">
                <WorkTICharacterImage
                  code={neighborCode}
                  fallbackIcon={detail.characterIcon}
                  size={136}
                  frameless
                  className="transition-transform duration-200 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <p className="text-code-lg text-primary-600">{neighborCode}</p>
                <p className="mt-1 text-body-md font-bold text-gray-950">{definition.title}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function PublicWorkTIProfile({ code }: PublicWorkTIProfileProps) {
  const detail = WORK_TI_RESULT_DETAILS[code];

  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-12 px-5 py-8 sm:px-8 sm:py-12 md:gap-16">
        <Link href="/work-ti" className="w-fit text-body-sm font-semibold text-gray-500 hover:text-gray-700">
          ← 16가지 Work-TI 유형으로
        </Link>

        <PublicTypeHero code={code} />

        <FixedAxes code={code} />

        <section className="flex flex-col gap-6">
          <SectionHeader eyebrow="WORK STYLE" title="이 유형의 일하는 방식" />
          <div className="grid gap-6 md:grid-cols-3">
            <StyleColumn label="업무 스타일" text={detail.workLifeStyle} />
            <StyleColumn label="리더십 스타일" text={detail.leadershipStyle} />
            <StyleColumn label="커뮤니케이션 스타일" text={detail.communicationStyle} />
          </div>
        </section>

        <FitSection
          eyebrow="BEST FIT"
          title="잘 맞는 회사와 업무 환경"
          summary={detail.goodFitCompany.summary}
          points={detail.goodFitCompany.points}
        />

        <section className="flex flex-col gap-5">
          <SectionHeader eyebrow="GROWTH NOTES" title="스트레스 요인과 성장 팁" />
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-body-md font-bold text-gray-950">스트레스 요인</p>
              <p className="mt-3 text-body-sm leading-6 text-gray-600">{detail.stressTrigger}</p>
            </article>
            <article className="rounded-lg border border-primary-100 bg-primary-50 p-6">
              <p className="text-body-md font-bold text-primary-800">성장 팁</p>
              <p className="mt-3 text-body-sm leading-6 text-gray-700">{detail.growthTip}</p>
            </article>
          </div>
        </section>

        <OtherTypes code={code} />

        <section className="flex flex-col items-start justify-between gap-7 rounded-xl bg-primary-50 px-6 py-9 sm:px-10 md:flex-row md:items-center lg:px-12">
          <div>
            <p className="text-code-sm text-primary-600">FIND YOUR TYPE</p>
            <h2 className="mt-2 text-heading-2 text-gray-950">나의 Work-TI는 무엇일까요?</h2>
            <p className="mt-2 text-body-md text-gray-600">3분 테스트로 나의 실제 업무 성향 조합을 확인해보세요.</p>
          </div>
          <Button href="/test/start" variant="primary" size="lg" className="shrink-0">
            내 Work-TI 검사하기
          </Button>
        </section>
      </div>
    </div>
  );
}
