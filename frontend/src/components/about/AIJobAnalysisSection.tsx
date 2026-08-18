import { SectionKicker } from "@/components/about/SectionKicker";

const PROCESS_STEPS = ["원문", "AI 분석", "기업 확인·수정", "발행"];

const AFTER_STAGES = ["코딩테스트 없음", "과제 전형", "면접 1회"];

function AfterField({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <span className="mb-2 block text-caption font-bold tracking-wide text-gray-400">{label}</span>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-body-sm font-semibold text-gray-700"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * AI-ASSISTED JOB ANALYSIS — a static Before/After preview only (no real AI
 * call): mirrors the visual language of the real company job-posting AI
 * review flow (Chip-style pill tags, confirm/edit actions) without touching
 * that flow's actual logic.
 */
export function AIJobAnalysisSection() {
  return (
    <section className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1120px] px-8 py-16 md:py-24">
        <div className="mx-auto mb-10 flex max-w-[640px] flex-col items-center gap-9 text-center">
          <SectionKicker>AI-ASSISTED JOB ANALYSIS</SectionKicker>
          <h2 className="text-heading-2 text-gray-950">
            기업에게
            <br />
            채용 공고 등록은 더 간편하게 제공합니다.
          </h2>
          <p className="text-body-md leading-8 text-gray-700">
            기존 채용 공고의 원문을 입력하면 AI가 {" "}
            <strong className="font-bold text-gray-950">채용 전형과 직무 정보를 찾아 정리합니다.</strong>
            <br />기업은 편리하게 분석된 내용을 직접 확인하고 수정한 뒤 공고를 발행할 수 있습니다.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-1.5">
          {PROCESS_STEPS.map((step, index) => {
            const isLast = index === PROCESS_STEPS.length - 1;
            return (
              <div key={step} className="flex items-center gap-1.5">
                <span
                  className={
                    isLast
                      ? "rounded-full bg-primary-600 px-4 py-2 text-caption font-bold text-white"
                      : "rounded-full bg-primary-50 px-4 py-2 text-caption font-bold text-primary-600"
                  }
                >
                  {step}
                </span>
                {!isLast && (
                  <span className="px-0.5 text-gray-300" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <span className="mb-3.5 block text-caption font-bold tracking-wide text-gray-500">
              BEFORE — 원문 공고
            </span>
            <div className="rounded-lg border border-gray-200 bg-white p-7">
              <p className="text-body-sm italic leading-8 text-gray-600">
                &ldquo;저희와 함께할 프로덕트 디자이너를 찾습니다. 서류 합격 후 포트폴리오 기반 과제를 진행하며,
                이후 실무진 면접을 거쳐 최종 합격자를 선발합니다. 관련 경력 3년 이상이신 분을 우대합니다...&rdquo;
              </p>
            </div>
          </div>

          <span className="hidden text-heading-2 font-light text-primary-600 md:block" aria-hidden="true">
            →
          </span>

          <div>
            <span className="mb-3.5 block text-caption font-bold tracking-wide text-primary-600">
              AFTER — AI 분석 결과 · 확인 전
            </span>
            <div className="flex flex-col gap-4.5 rounded-lg bg-primary-50 p-7">
              <AfterField label="채용 전형" values={AFTER_STAGES} />
              <AfterField label="직무" values={["프로덕트 디자이너"]} />
              <AfterField label="경력" values={["3년 이상"]} />
              <div className="flex gap-2.5 border-t border-primary-100 pt-4">
                <button
                  type="button"
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-body-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:shadow-focus"
                >
                  수정하기
                </button>
                <button
                  type="button"
                  className="rounded-full bg-primary-600 px-4 py-2 text-body-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:shadow-focus"
                >
                  확인 완료
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-body-lg font-bold text-gray-950">
            AI로 공고를 쉽게 정리해보세요.
          </p>
          <p className="max-w-[520px] text-body-md leading-8 text-gray-700">
            AI가 공고 작성을 쉽고 편리하게 도와줍니다.
            <br />
            공고 속 정보를 구조화하고, 최종 확인과 발행은 기업이 직접 진행합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
