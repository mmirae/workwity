"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import { WORK_TI_RESULTS, type WorkTICode } from "@/data/workti/worktiData";
import { requestJobFitAnalysis } from "@/lib/ai/jobFitAnalysisClient";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  WORK_STYLE_AXIS_META,
  WORK_STYLE_TENDENCY_LABELS,
  type JobFitAnalysisResult,
} from "@/lib/ai/jobFitAnalysisSchema";
import { getStoredResult } from "@/lib/workti/testStorage";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const MAX_TEXT_LENGTH = 6000;

function subscribeToStoredResult(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getStoredResultCode(): WorkTICode | null {
  const result = getStoredResult();
  return result && Object.hasOwn(WORK_TI_RESULTS, result.code) ? result.code : null;
}

function ResultList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="text-body-sm text-gray-500">{emptyText}</p>;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-body-sm leading-6 text-gray-700">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-600" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function AnalysisResult({ result }: { result: JobFitAnalysisResult }) {
  const allAxesLackEvidence = result.workStyleSignals.every(
    (signal) => signal.tendency === "판단 근거 부족"
  );

  return (
    <div className="flex flex-col gap-6" aria-live="polite">
      <Card variant="featured">
        <p className="text-code-sm text-primary-600">AI SUMMARY</p>
        <h2 className="mt-2 text-heading-3 text-gray-950">공고 핵심 요약</h2>
        <p className="mt-3 text-body-md leading-7 text-gray-700">{result.summary}</p>
      </Card>

      <section>
        <h2 className="text-heading-3 text-gray-950">이 공고가 중요하게 보는 핵심 역량</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {result.coreCompetencies.map((competency, index) => (
            <Card key={competency} variant="base" className="flex items-center gap-3 p-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-bold text-primary-700">
                {index + 1}
              </span>
              <span className="text-body-sm font-bold text-gray-800">{competency}</span>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-heading-3 text-gray-950">내 Work-TI와 업무환경 비교</h2>
          <p className="mt-2 text-body-sm leading-6 text-gray-600">
            궁합 점수보다 공고에서 확인되는 업무 방식을 이해하기 위한 참고 정보입니다.
          </p>
        </div>
        <div>
          <h3 className="text-body-lg font-bold text-gray-950">공고에서 읽히는 Work-TI 업무 성향</h3>
        {result.workStyleSignals.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {result.workStyleSignals.map((signal) => (
              <Card key={signal.axis} variant="base" className="p-5">
                <p className="text-code-sm text-primary-600">
                  {signal.axis} · {WORK_STYLE_AXIS_META[signal.axis].name}
                </p>
                <p className="mt-2 text-body-md font-bold text-gray-950">
                  {signal.tendency === "혼합" || signal.tendency === "판단 근거 부족"
                    ? signal.tendency
                    : WORK_STYLE_TENDENCY_LABELS[signal.tendency]}
                </p>
                <p className="mt-4 text-caption font-bold text-gray-500">공고 근거</p>
                <p className="mt-1 text-body-sm leading-6 text-gray-600">{signal.reason}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="base" className="mt-4">
            <p className="text-body-sm text-gray-500">공고에서 업무 성향을 판단할 충분한 근거를 찾지 못했습니다.</p>
          </Card>
        )}
        </div>

        <div>
        <h3 className="text-body-lg font-bold text-gray-950">내 유형과 축별 비교</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card variant="base">
            <h3 className="text-body-md font-bold text-primary-700">잘 맞는 점</h3>
            <div className="mt-3">
              <ResultList
                items={result.fitPoints}
                emptyText={
                  allAxesLackEvidence
                    ? "공고만으로 명확한 공통점을 판단하기 어렵습니다."
                    : "현재 공고에서 명확하게 확인된 Work-TI 성향 중 내 유형과 일치하는 축은 없습니다."
                }
              />
            </div>
          </Card>
          <Card variant="base">
            <h3 className="text-body-md font-bold text-gray-950">확인할 점</h3>
            <div className="mt-3">
              <ResultList items={result.checkPoints} emptyText="추가로 확인할 뚜렷한 차이를 찾지 못했습니다." />
            </div>
          </Card>
        </div>
        </div>

      </section>

      <section>
        <h2 className="text-heading-3 text-gray-950">지원 시 강조하면 좋은 경험</h2>
        <p className="mt-2 text-body-sm text-gray-600">이런 경험이 있다면 지원서와 면접에서 강조해 보세요.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {result.highlightExperiences.map((item) => (
            <Card key={item.experience} variant="base" className="p-5">
              <h3 className="text-body-md font-bold text-gray-950">{item.experience}</h3>
              <p className="mt-2 text-body-sm leading-6 text-gray-600">{item.reason}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card variant="base">
        <h2 className="text-heading-3 text-gray-950">면접에서 받을 예상 핵심 질문 5개</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {result.interviewQuestions.map((question, index) => (
            <li key={question} className="flex gap-3 text-body-sm leading-6 text-gray-700">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-bold text-primary-700">
                {index + 1}
              </span>
              <span>{question}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

export default function JobAnalysisPage() {
  const { role } = useAuth();
  const storedWorkTICode = useSyncExternalStore(subscribeToStoredResult, getStoredResultCode, () => null);
  const workTICode = role === "seeker" ? storedWorkTICode : null;
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<JobFitAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workTICode || !jobText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      setResult(await requestJobFitAnalysis(jobText.trim(), workTICode));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "AI 분석 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto flex max-w-[900px] flex-col gap-8 px-5 py-12 sm:px-8 md:py-16">
        <header>
          <p className="text-code-sm text-primary-600">AI JOB ANALYSIS</p>
          <h1 className="mt-3 text-heading-1 text-gray-950">이 공고, 나와 잘 맞을까?</h1>
          <p className="mt-3 max-w-[760px] text-body-lg text-gray-600">
            관심 있는 채용공고를 붙여넣으면 AI가 공고의 업무 특성을 분석하고 내 Work-TI와 함께 살펴봅니다.
          </p>
        </header>

        {role === "seeker" ? (
          <>
            {workTICode ? (
              <Card variant="base" className="flex items-center gap-4 p-5">
                <span className="text-code-lg text-primary-600">{workTICode}</span>
                <div>
                  <p className="text-caption text-gray-500">현재 내 Work-TI</p>
                  <p className="text-body-md font-bold text-gray-950">{WORK_TI_RESULTS[workTICode].title}</p>
                </div>
              </Card>
            ) : (
              <Card variant="featured" className="flex flex-col items-start gap-4">
                <div>
                  <p className="text-caption text-gray-500">현재 내 Work-TI</p>
                  <p className="mt-2 text-body-lg font-bold text-gray-950">검사 결과가 없습니다.</p>
                </div>
                <Button href="/test/start" variant="secondary" size="md">
                  Work-TI 테스트하러 가기
                </Button>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="job-text" className="text-body-md font-bold text-gray-950">
                채용공고 원문
              </label>
              <textarea
                id="job-text"
                value={jobText}
                onChange={(event) => setJobText(event.target.value)}
                placeholder="채용공고 내용을 붙여넣어 주세요."
                maxLength={MAX_TEXT_LENGTH}
                className="min-h-[300px] w-full resize-y rounded-lg border border-gray-300 bg-white p-5 text-body-md text-gray-950 outline-none transition focus:border-primary-600 focus:shadow-focus"
              />
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-caption text-gray-400">
                  {jobText.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}자
                </span>
                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    disabled={!workTICode || !jobText.trim()}
                  >
                    {isLoading ? "분석 중..." : "AI로 분석하기"}
                  </Button>
                  {!workTICode && (
                    <span className="text-caption text-gray-500">
                      Work-TI 검사 후 AI 공고 분석을 이용할 수 있어요.
                    </span>
                  )}
                </div>
              </div>
              {error && <p className="rounded-md bg-danger-100 p-4 text-body-sm text-danger-600">{error}</p>}
            </form>
          </>
        ) : (
          <Card variant="featured" className="flex flex-col items-start gap-4">
            <div>
              <h2 className="text-heading-3 text-gray-950">
                {role === "company" ? "구직자 계정으로 이용해주세요." : "AI 공고 분석을 사용하려면 먼저 로그인해주세요."}
              </h2>
              <p className="mt-2 text-body-sm leading-6 text-gray-600">
                {role === "company"
                  ? "AI 공고 분석은 구직자의 저장된 Work-TI 결과를 바탕으로 제공됩니다."
                  : "상단 로그인 메뉴에서 구직자로 로그인하거나 Work-TI 검사를 먼저 진행할 수 있습니다."}
              </p>
            </div>
            <Button href="/test/start" variant="primary" size="lg">
              내 Work-TI 알아보기
            </Button>
          </Card>
        )}

        {result && <AnalysisResult result={result} />}
      </div>
    </div>
  );
}
