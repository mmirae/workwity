"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  WORK_TI_RESULT_DETAILS,
  WORK_TI_RESULTS,
  type WorkTICode,
  type WorkTIResultDefinition,
} from "@/data/workti/worktiData";
import { getStoredResult } from "@/lib/workti/testStorage";
import { WorkTICharacterImage } from "@/components/workti/WorkTICharacterImage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface AxisTrait {
  code: string;
  word: string;
  label: string;
  points: readonly string[];
}

interface AxisDefinition {
  number: string;
  name: string;
  question: string;
  accent: string;
  surface: string;
  border: string;
  left: AxisTrait;
  right: AxisTrait;
}

const AXES: readonly AxisDefinition[] = [
  {
    number: "01",
    name: "EXECUTION STYLE",
    question: "새로운 일이나 과제가 주어졌을 때, 첫 발을 어떻게 떼는가?",
    accent: "text-primary-600",
    surface: "bg-primary-50",
    border: "border-primary-600",
    left: {
      code: "S",
      word: "Seed",
      label: "가설실행형",
      points: [
        "최소한의 가설이 있으면 빠르게 실행",
        "초안과 테스트를 통해 피드백을 얻고 개선",
        "빠른 검증과 0 to 1 환경에 강점",
      ],
    },
    right: {
      code: "L",
      word: "Leaf",
      label: "리서치분석형",
      points: [
        "충분한 데이터를 수집하고 분석한 뒤 실행",
        "사례 조사와 정교한 계획을 선호",
        "실패 비용이 높거나 정밀한 판단이 필요한 환경에 강점",
      ],
    },
  },
  {
    number: "02",
    name: "DECISION MAKING",
    question: "목표를 향해 나아갈 때, 결정의 주도권과 규칙을 어디에 두는가?",
    accent: "text-teal-600",
    surface: "bg-teal-100",
    border: "border-teal-600",
    left: {
      code: "E",
      word: "sElf",
      label: "자율주도형",
      points: [
        "목표와 맥락이 주어지면 스스로 판단하고 실행",
        "높은 자율성과 권한 위임을 선호",
        "자기 완결적인 업무 환경에 강점",
      ],
    },
    right: {
      code: "Y",
      word: "sYstem",
      label: "체계합의형",
      points: [
        "명확한 규칙과 프로세스를 기반으로 결정",
        "팀과 정보를 공유하고 합의하며 진행",
        "협업 부서와 승인 절차가 많은 환경에 강점",
      ],
    },
  },
  {
    number: "03",
    name: "SPEED & QUALITY",
    question: "마감과 완성도가 충돌할 때, 타협할 수 없는 기준은 무엇인가?",
    accent: "text-violet-600",
    surface: "bg-violet-100",
    border: "border-violet-600",
    left: {
      code: "M",
      word: "Minimum",
      label: "스피드/린",
      points: [
        "핵심 기능 중심으로 빠르게 결과물을 완성",
        "빠른 반복과 개선을 선호",
        "속도와 시장 타이밍이 중요한 환경에 강점",
      ],
    },
    right: {
      code: "D",
      word: "Detail",
      label: "완벽주의형",
      points: [
        "오류와 예외 상황까지 세밀하게 확인",
        "높은 완성도와 품질을 중요하게 생각",
        "오류 비용이 큰 환경에 강점",
      ],
    },
  },
  {
    number: "04",
    name: "VALUE ORIENTATION",
    question: "일을 통해 궁극적으로 얻고자 하는 보상과 환경은 무엇인가?",
    accent: "text-coral-600",
    surface: "bg-coral-100",
    border: "border-coral-600",
    left: {
      code: "G",
      word: "Growth",
      label: "성장모험형",
      points: [
        "변화와 새로운 도전을 선호",
        "빠른 성장과 다양한 역할에서 동기를 얻음",
        "스케일업이나 신규 사업 환경에 강점",
      ],
    },
    right: {
      code: "A",
      word: "stAbility",
      label: "안정조화형",
      points: [
        "지속 가능한 업무 속도와 예측 가능한 환경을 중요하게 생각",
        "전문성과 안정적인 커리어 성장을 선호",
        "체계가 갖춰지고 워라밸이 보장되는 환경에 강점",
      ],
    },
  },
] as const;

const TYPE_ORDER = Object.keys(WORK_TI_RESULTS) as WorkTICode[];

function subscribeToStoredResult(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getStoredResultCode(): WorkTICode | null {
  const storedResult = getStoredResult();
  return storedResult && storedResult.code in WORK_TI_RESULTS ? storedResult.code : null;
}

function AxisLetterMatrix() {
  const rows = [
    { codes: ["S", "L"], label: "EXECUTION", tile: "bg-primary-100", text: "text-primary-600" },
    { codes: ["E", "Y"], label: "DECISION", tile: "bg-teal-100", text: "text-teal-600" },
    { codes: ["M", "D"], label: "SPEED", tile: "bg-violet-100", text: "text-violet-600" },
    { codes: ["G", "A"], label: "VALUE", tile: "bg-coral-100", text: "text-coral-600" },
  ] as const;

  return (
    <div className="flex w-full max-w-[510px] flex-col gap-3" aria-label="Work-TI 문자 조합">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2.5 sm:gap-3">
          {row.codes.map((code) => (
            <div
              key={code}
              className={cn(
                "flex h-18 items-center justify-center rounded-lg font-mono text-[38px] font-bold sm:h-22 sm:text-[44px]",
                row.tile,
                row.text
              )}
            >
              {code}
            </div>
          ))}
          <span className={cn("w-17 text-code-sm sm:w-19", row.text)}>{row.label}</span>
        </div>
      ))}
    </div>
  );
}

function Trait({ trait, accent }: { trait: AxisTrait; accent: string }) {
  return (
    <div className="grid grid-cols-[72px_1fr] items-start gap-4 sm:grid-cols-[96px_1fr] sm:gap-6 lg:grid-cols-[132px_1fr] lg:gap-7">
      <span
        className={cn(
          "font-mono text-[76px] leading-none font-bold sm:text-[100px] lg:text-[132px] lg:leading-[1.05]",
          accent
        )}
        aria-hidden="true"
      >
        {trait.code}
      </span>
      <div className="min-w-0 pt-1 sm:pt-2 lg:pt-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className={cn("font-mono text-[22px] font-bold sm:text-code-lg", accent)}>{trait.word}</span>
          <h3 className="text-[19px] leading-7 font-bold text-gray-950 sm:text-heading-3">{trait.label}</h3>
        </div>
        <ul className="mt-3 flex flex-col gap-1.5 text-body-sm text-gray-700 sm:text-body-md">
          {trait.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AxisComparison({ axis }: { axis: AxisDefinition }) {
  return (
    <article className={cn("border-t-[3px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11", axis.surface, axis.border)}>
      <div className="grid gap-5 md:grid-cols-[240px_1fr] md:gap-12">
        <div>
          <span className={cn("text-code-lg", axis.accent)}>{axis.number}</span>
          <p className="mt-1 text-code-sm text-gray-700">{axis.name}</p>
        </div>
        <div>
          <p className={cn("text-caption font-semibold", axis.accent)}>QUESTION</p>
          <h3 className="mt-1.5 text-[21px] leading-8 font-bold text-gray-950 sm:text-heading-3">{axis.question}</h3>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1px_1fr] md:items-stretch lg:mt-10">
        <Trait trait={axis.left} accent={axis.accent} />
        <div className="h-px w-full bg-gray-300 md:h-full md:min-h-[190px] md:w-px" aria-hidden="true" />
        <Trait trait={axis.right} accent={axis.accent} />
      </div>
    </article>
  );
}

interface WorkTITypeCardProps {
  definition: WorkTIResultDefinition;
  isMyType: boolean;
  /** Supply this when the public /work-ti/[code] route is introduced. */
  detailHref?: string;
}

function WorkTITypeCard({ definition, isMyType, detailHref }: WorkTITypeCardProps) {
  const content = (
    <>
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-primary-50 sm:h-48">
        {isMyType && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-primary-600 px-2.5 py-1 text-caption font-bold text-white">
            MY TYPE
          </span>
        )}
        <WorkTICharacterImage
          code={definition.code}
          fallbackIcon={WORK_TI_RESULT_DETAILS[definition.code].characterIcon}
          size={176}
          frameless
          className="p-2 transition-transform duration-200 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-code-lg text-primary-600">{definition.code}</p>
        <h3 className="mt-2 text-body-lg font-bold text-gray-950">{definition.title}</h3>
        <p className="mt-2 line-clamp-3 text-body-sm text-gray-600">{definition.description}</p>
        <span className="mt-auto pt-5 text-body-sm font-bold text-primary-700">
          자세히 보기 <span aria-hidden="true">→</span>
        </span>
      </div>
    </>
  );

  const classes =
    "group flex h-full min-h-[410px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-sm focus-visible:outline-none focus-visible:shadow-focus";

  if (detailHref) {
    return (
      <Link href={detailHref} className={classes}>
        {content}
      </Link>
    );
  }

  return <article className={classes}>{content}</article>;
}

export function WorkTIExploreContent() {
  const myType = useSyncExternalStore(subscribeToStoredResult, getStoredResultCode, () => null);

  const actionHref = myType ? "/me" : "/test/start";
  const actionLabel = myType ? "내 결과 다시 보기" : "내 Work-TI 알아보기";

  return (
    <>
      <section className="bg-primary-50">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-18 lg:py-22">
          <div className="max-w-[610px]">
            <p className="text-code-sm text-primary-700">WORK IDENTITY</p>
            <h1 className="mt-4 text-display-xl text-gray-950">Work-TI 알아보기</h1>
            <p className="mt-4 text-heading-3 font-bold text-primary-700">일하는 방식에는 정답보다 방향이 있습니다.</p>
            <p className="mt-4 max-w-[570px] text-body-lg text-gray-600">
              Work-TI는 사용자의 일하는 방식을 실행, 의사결정, 속도와 품질, 가치 지향의 4개 핵심 축으로 이해하는
              테스트입니다. 여덟 글자의 의미를 익히고, 나와 닮은 16개 유형을 탐색해보세요.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button href={actionHref} variant="primary" size="lg">
                {actionLabel}
              </Button>
              <Link href="#work-ti-dimensions" className="text-body-sm font-bold text-primary-700 hover:text-primary-800">
                4개 축 먼저 이해하기 ↓
              </Link>
            </div>
          </div>
          <AxisLetterMatrix />
        </div>
      </section>

      <section id="work-ti-dimensions" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 md:py-26 lg:py-32">
          <p className="text-code-sm text-primary-600">WORK-TI DIMENSIONS</p>
          <h2 className="mt-3 text-heading-1 text-gray-950">Work-TI의 4개 핵심 축</h2>
          <p className="mt-3 max-w-[860px] text-body-lg text-gray-600">
            일하는 방식은 네 가지 질문에서 시작됩니다. 서로 다른 두 성향 사이에서 나에게 더 자연스러운 쪽을
            발견해 보세요.
          </p>

          <div className="mt-12 flex flex-col gap-10 sm:mt-16 md:gap-14">
            {AXES.map((axis) => (
              <AxisComparison key={axis.number} axis={axis} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50" aria-labelledby="work-ti-types-title">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 md:py-26 lg:py-28">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="work-ti-types-title" className="text-heading-1 text-gray-950">
                16가지 Work-TI 유형
              </h2>
              <p className="mt-2 text-body-lg text-gray-600">4개의 업무 성향 조합으로 다양한 Work-TI 유형이 만들어집니다.</p>
            </div>
            <p className="text-code-sm text-primary-600">코드 순서 S/L · E/Y · M/D · G/A</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {TYPE_ORDER.map((code) => (
              <WorkTITypeCard
                key={code}
                definition={WORK_TI_RESULTS[code]}
                isMyType={myType === code}
                detailHref={`/work-ti/${code}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-8 rounded-xl bg-primary-50 px-6 py-10 sm:px-10 md:flex-row md:items-center lg:px-13 lg:py-11">
            <div>
              <h2 className="text-heading-2 text-gray-950">나의 네 글자는 무엇일까요?</h2>
              <p className="mt-2 max-w-[690px] text-body-lg text-gray-600">
                3분 테스트로 나의 업무 성향을 확인하고, 나와 맞는 일하는 환경을 찾아보세요.
              </p>
            </div>
            <Button href={actionHref} variant="primary" size="lg" className="shrink-0">
              {actionLabel}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
