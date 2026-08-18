"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createWorkTIResultFromScores } from "@/data/workti/worktiData";
import { MOCK_JOBS } from "@/lib/mock/jobs";
import { computeJobMatch } from "@/lib/workti/matchJob";
import { buildAiFitSummary } from "@/lib/workti/aiFitSummary";
import { getStoredResult, type StoredWorkTIResult } from "@/lib/workti/testStorage";
import { getApplication, saveApplication } from "@/lib/jobs/applicationStorage";
import { recordRecentJob } from "@/lib/jobs/recentJobsStorage";
import { Button } from "@/components/ui/Button";
import { ApplyModal } from "@/components/jobs/ApplyModal";
import { JobSaveHeart } from "@/components/jobs/JobSaveHeart";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const job = MOCK_JOBS.find((j) => j.id === params.id);

  const [userResult, setUserResult] = useState<StoredWorkTIResult | null | undefined>(undefined);
  const [applied, setApplied] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    if (!job) {
      router.replace("/jobs");
      return;
    }
    setUserResult(getStoredResult());
    setApplied(Boolean(getApplication(job.id)));
    recordRecentJob(job.id);
  }, [job, router]);

  const companyFull = useMemo(() => (job ? createWorkTIResultFromScores(job.companyScores) : null), [job]);
  const match = useMemo(
    () => (userResult && job ? computeJobMatch(userResult, job.companyScores) : null),
    [userResult, job]
  );
  const aiSummary = useMemo(() => (match ? buildAiFitSummary(match) : null), [match]);

  if (!job || !companyFull) return null;

  const handleApplySubmitted = (shareReport: boolean) => {
    saveApplication({
      jobId: job.id,
      matchPctSnapshot: match?.percentage,
      appliedAt: new Date().toISOString(),
      shareReport,
    });
    setApplied(true);
  };

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-4.5 px-8 py-6">
      <Link href="/jobs" className="w-fit text-body-sm text-gray-500 hover:text-gray-700">
        ← 공고 리스트로
      </Link>

      <div className="grid items-start gap-6 md:grid-cols-[1fr_348px]">
        <div className="flex flex-col gap-4.5">
          <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-7 shadow-xs">
            <div className="flex items-center gap-2">
              <JobSaveHeart jobId={job.id} />
              <span className="text-body-sm text-gray-500">{job.company}</span>
            </div>
            <h1 className="text-heading-2 text-gray-950">{job.title}</h1>
            <span className="text-caption text-gray-400">
              {job.functionCategory} · {job.careerLabel}
            </span>
          </div>

          {match && aiSummary ? (
            <div className="flex flex-col gap-4.5 rounded-lg border-2 border-primary-600 bg-white p-7">
              <div className="flex items-center gap-3">
                <span className="rounded-sm bg-primary-100 px-2.5 py-1 text-code-sm text-primary-700">AI</span>
                <h3 className="text-body-md font-bold text-gray-950">Work Identity Match 분석</h3>
                <div className="ml-auto flex items-baseline gap-2">
                  <span className="text-heading-1 text-primary-600">{match.percentage}%</span>
                  <span className="text-code-sm text-primary-600">MATCH</span>
                </div>
              </div>
              <p className="text-body-md leading-7 text-gray-700">{aiSummary.summarySentence}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2 rounded-md bg-primary-50 p-4">
                  <span className="text-body-sm font-bold text-primary-700">잘 맞는 축</span>
                  {aiSummary.wellMatchedAxes.map((axis) => (
                    <span key={axis} className="text-body-sm text-primary-800">
                      · {axis}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2 rounded-md bg-gray-50 p-4">
                  <span className="text-body-sm font-bold text-gray-600">다른 축 · 참고</span>
                  {aiSummary.gapAxes.length > 0 ? (
                    aiSummary.gapAxes.map((axis) => (
                      <span key={axis} className="text-body-sm text-gray-600">
                        · {axis}
                      </span>
                    ))
                  ) : (
                    <span className="text-body-sm text-gray-400">차이가 두드러진 축이 없어요</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-7 text-center">
              <span className="text-body-md font-bold text-gray-950">Work-TI를 완료하면 AI 핏 리포트를 볼 수 있어요</span>
              <p className="text-body-sm text-gray-500">이 공고와 내 일하는 방식이 얼마나 잘 맞는지 확인해 보세요</p>
              <Button variant="primary" size="sm" href="/test">
                3분 만에 알아보기
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-7 shadow-xs">
            <div className="flex items-center gap-2.5">
              <h3 className="text-body-md font-bold text-gray-950">채용 전형</h3>
              <span className="rounded-sm bg-primary-100 px-2.5 py-1 text-caption font-semibold text-primary-700">
                총 {job.process.length}단계
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {job.process.map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-body-sm font-semibold text-gray-900">
                    {step}
                  </span>
                  {index < job.process.length - 1 && <span className="text-gray-300">→</span>}
                </div>
              ))}
            </div>
            <span className="text-caption text-gray-400">예상 소요 {job.duration}</span>
          </div>

          <div className="flex flex-col gap-5 rounded-lg border border-gray-200 bg-white p-7 shadow-xs">
            <div className="flex flex-col gap-2.5">
              <h3 className="text-body-md font-bold text-gray-950">주요 업무</h3>
              {job.duties.map((duty) => (
                <span key={duty} className="text-body-sm leading-7 text-gray-700">
                  · {duty}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4.5">
              <h3 className="text-body-md font-bold text-gray-950">자격 요건</h3>
              {job.requirements.map((req) => (
                <span key={req} className="text-body-sm leading-7 text-gray-700">
                  · {req}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-3.5 md:sticky md:top-22">
          <div className="flex flex-col gap-1.5 rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-code-sm text-gray-400">TEAM WORK-TI</span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-code-lg text-gray-950">{companyFull.code}</span>
              <span className="text-body-sm font-semibold text-gray-700">{companyFull.definition.title}</span>
            </div>
            {companyFull.definition.description && (
              <p className="text-caption leading-6 text-gray-500">{companyFull.definition.description}</p>
            )}
          </div>

          {applied ? (
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-primary-100 bg-primary-50 p-4.5 text-center">
              <span className="text-heading-3 text-primary-600">✓</span>
              <span className="text-body-sm font-bold text-primary-700">지원이 완료되었습니다</span>
              <span className="text-caption text-primary-700">결과는 이메일과 마이페이지로 안내됩니다</span>
            </div>
          ) : (
            <Button variant="primary" size="lg" onClick={() => setApplyOpen(true)} fullWidth>
              지원하기
            </Button>
          )}

          <p className="px-1 text-caption leading-6 text-gray-400">
            Work-TI는 합격 가능성을 예측하지 않습니다. 서로의 일하는 방식을 이해하기 위한 참고 지표입니다.
          </p>
        </aside>
      </div>

      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        company={job.company}
        jobTitle={job.title}
        matchPct={match?.percentage}
        onSubmitted={handleApplySubmitted}
      />
    </div>
  );
}
