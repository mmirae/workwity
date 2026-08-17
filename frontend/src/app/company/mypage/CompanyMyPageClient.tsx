"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createWorkTIResultFromScores } from "@/data/workti/worktiData";
import { COMPANY_WORK_TI_RESULTS } from "@/data/workti/companyWorktiData";
import { getCompanyResult } from "@/lib/company/companyStorage";
import { addCompanyJob, getCompanyJobs } from "@/lib/company/companyJobsStorage";
import { getApplicantStatus, setApplicantStatus, type ApplicantStatus } from "@/lib/company/applicantStatusStorage";
import { SEED_APPLICANTS, type CompanyJobPosting, type MockApplicant } from "@/lib/mock/companyApplicants";
import { STAGE_FILTER_OPTIONS } from "@/lib/mock/jobs";
import { computeJobMatch } from "@/lib/workti/matchJob";
import { buildAiFitSummary } from "@/lib/workti/aiFitSummary";
import { AXIS_ORDER } from "@/lib/workti/axisMeta";
import type { StoredWorkTIResult } from "@/lib/workti/testStorage";
import { WorkTIReportCard } from "@/components/workti/WorkTIReportCard";
import { CompareAxisRow } from "@/components/workti/CompareAxisRow";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type MainTab = "jobs" | "workti";
type JobsView = "list" | "new" | "applicants" | "applicant-detail";

const STATUS_OPTIONS: ApplicantStatus[] = ["신규", "검토중", "합격", "불합격"];

function stageLabel(key: string): string {
  return STAGE_FILTER_OPTIONS.find((o) => o.key === key)?.label ?? key;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-1 pb-3.5 text-body-md font-semibold transition-colors",
        active ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500 hover:text-gray-700"
      )}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
      <span className="text-body-sm text-gray-500">{label}</span>
      <span className="text-heading-3 text-gray-950">{value}</span>
    </div>
  );
}

export default function CompanyMyPageClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<MainTab>(searchParams.get("tab") === "workti" ? "workti" : "jobs");

  const [ready, setReady] = useState(false);
  const [companyResult, setCompanyResult] = useState<StoredWorkTIResult | null>(null);
  const [jobs, setJobs] = useState<CompanyJobPosting[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const [view, setView] = useState<JobsView>("list");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicantStatus | "전체">("전체");
  const [statusVersion, setStatusVersion] = useState(0);

  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [analysis, setAnalysis] = useState<"idle" | "loading" | "done">("idle");
  const [newStageTags, setNewStageTags] = useState<string[]>([]);
  const [newHasCoding, setNewHasCoding] = useState<"없음" | "있음">("없음");

  useEffect(() => {
    setCompanyResult(getCompanyResult());
    setJobs(getCompanyJobs());
    setReady(true);
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;

  const jobApplicants = useMemo(
    () => SEED_APPLICANTS.filter((a) => a.jobId === selectedJobId),
    [selectedJobId]
  );

  const applicantsWithMatch = useMemo(() => {
    const rows = jobApplicants.map((applicant) => ({
      applicant,
      matchPct: companyResult ? computeJobMatch(companyResult, applicant.workTIScores).percentage : undefined,
      status: getApplicantStatus(applicant.id),
    }));
    return rows.sort((a, b) => (b.matchPct ?? 0) - (a.matchPct ?? 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobApplicants, companyResult, statusVersion]);

  const visibleApplicants =
    statusFilter === "전체" ? applicantsWithMatch : applicantsWithMatch.filter((row) => row.status === statusFilter);

  const allOwnedApplicants = useMemo(
    () => SEED_APPLICANTS.filter((a) => jobs.some((j) => j.id === a.jobId)),
    [jobs]
  );
  const newApplicantCount = allOwnedApplicants.filter((a) => getApplicantStatus(a.id) === "신규").length;
  const averageMatch =
    companyResult && allOwnedApplicants.length > 0
      ? Math.round(
          allOwnedApplicants.reduce((sum, a) => sum + computeJobMatch(companyResult, a.workTIScores).percentage, 0) /
            allOwnedApplicants.length
        )
      : null;

  const selectedApplicant = SEED_APPLICANTS.find((a) => a.id === selectedApplicantId) ?? null;
  const applicantMatch =
    companyResult && selectedApplicant ? computeJobMatch(companyResult, selectedApplicant.workTIScores) : null;
  const applicantFit = applicantMatch ? buildAiFitSummary(applicantMatch) : null;
  const applicantCode = selectedApplicant
    ? createWorkTIResultFromScores(selectedApplicant.workTIScores).code
    : null;

  const openJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setStatusFilter("전체");
    setView("applicants");
  };

  const openApplicant = (applicantId: string) => {
    setSelectedApplicantId(applicantId);
    setView("applicant-detail");
  };

  const toggleNewStageTag = (key: string) => {
    setNewStageTags((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const runAnalysis = () => {
    setAnalysis("loading");
    window.setTimeout(() => {
      setNewStageTags(STAGE_FILTER_OPTIONS.slice(0, 2).map((o) => o.key));
      setAnalysis("done");
    }, 900);
  };

  const publishJob = () => {
    if (!newTitle.trim()) {
      showToast("공고 제목을 입력해 주세요");
      return;
    }
    const posting: CompanyJobPosting = {
      id: `posting-${Date.now()}`,
      title: newTitle.trim(),
      status: "발행중",
      stageTags: newHasCoding === "없음" ? newStageTags : newStageTags.filter((k) => k !== "no-coding"),
      process: ["서류", "1차 실무면접"],
      postedAt: new Date().toISOString().slice(0, 10),
    };
    addCompanyJob(posting);
    setJobs(getCompanyJobs());
    setNewTitle("");
    setNewText("");
    setNewStageTags([]);
    setNewHasCoding("없음");
    setAnalysis("idle");
    setView("list");
    showToast("공고가 발행되었습니다");
  };

  const saveApplicantStatus = (status: ApplicantStatus) => {
    if (!selectedApplicant) return;
    setApplicantStatus(selectedApplicant.id, status);
    setStatusVersion((v) => v + 1);
    showToast("상태가 저장되었습니다 · 지원자에게 이메일이 발송됩니다");
  };

  if (!ready) return null;

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-8 py-8">
      <div className="flex gap-6 border-b border-gray-200">
        <TabButton active={activeTab === "jobs"} onClick={() => setActiveTab("jobs")}>
          공고 관리
        </TabButton>
        <TabButton active={activeTab === "workti"} onClick={() => setActiveTab("workti")}>
          기업 Work-TI
        </TabButton>
      </div>

      {activeTab === "workti" &&
        (companyResult ? (
          <WorkTIReportCard
            code={companyResult.code}
            definition={COMPANY_WORK_TI_RESULTS[companyResult.code]}
            axes={companyResult.axes}
            bonusBadges={companyResult.bonusBadges}
            kicker="TEAM WORK-TI REPORT"
            actions={
              <div className="flex gap-2.5">
                <Button variant="secondary" size="sm" href="/company/result">
                  전체 리포트 보기
                </Button>
                <Button variant="secondary" size="sm" href="/company/onboarding">
                  재응답
                </Button>
              </div>
            }
          />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
            <span className="text-body-md font-bold text-gray-950">아직 팀 Work-TI를 등록하지 않았어요</span>
            <p className="text-body-sm text-gray-500">팀이 일하는 방식을 등록하면 지원자와의 Match를 확인할 수 있어요</p>
            <Button variant="primary" size="sm" href="/company/onboarding">
              팀 Work-TI 시작하기
            </Button>
          </div>
        ))}

      {activeTab === "jobs" && view === "list" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-heading-3 text-gray-950">공고 관리</h1>
              <span className="text-body-sm text-gray-500">공고 {jobs.length}개</span>
            </div>
            <Button variant="primary" size="md" onClick={() => setView("new")}>
              + 공고 등록
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            <StatCard label="진행중 공고" value={String(jobs.filter((j) => j.status === "발행중").length)} />
            <StatCard label="전체 지원자" value={String(allOwnedApplicants.length)} />
            <StatCard label="신규 지원자" value={String(newApplicantCount)} />
            <StatCard label="평균 Match" value={averageMatch != null ? `${averageMatch}%` : "-"} />
          </div>

          <div className="flex flex-col gap-3">
            {jobs.map((job) => {
              const count = SEED_APPLICANTS.filter((a) => a.jobId === job.id).length;
              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => openJob(job.id)}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-6 text-left shadow-xs transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-body-md font-bold text-gray-950">{job.title}</span>
                      <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-caption font-semibold text-primary-700">
                        {job.status}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {job.stageTags.map((tag) => (
                        <span key={tag} className="rounded-sm border border-gray-200 bg-gray-50 px-2.5 py-1 text-caption text-gray-600">
                          {stageLabel(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-body-sm text-gray-500">지원자 {count}명</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "jobs" && view === "new" && (
        <div className="flex flex-col gap-4">
          <button type="button" onClick={() => setView("list")} className="w-fit text-body-sm text-gray-500 hover:text-gray-700">
            ← 공고 관리
          </button>
          <h1 className="text-heading-3 text-gray-950">공고 등록</h1>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-3.5 rounded-lg border border-gray-200 bg-white p-6 shadow-xs">
              <span className="text-body-sm font-bold text-gray-950">1 · 원문 입력</span>
              <input
                type="text"
                placeholder="공고 제목 (예: 프로덕트 디자이너)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-11 rounded-md border border-gray-300 px-3.5 text-body-sm text-gray-950 focus:border-primary-600 focus:outline-none focus:shadow-focus"
              />
              <textarea
                rows={10}
                placeholder="채용 공고 전문을 붙여넣으세요. 형식은 자유입니다."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="resize-y rounded-md border border-gray-300 px-3.5 py-3 text-body-sm leading-6 text-gray-950 focus:border-primary-600 focus:outline-none focus:shadow-focus"
              />
              <Button variant="primary" size="md" onClick={runAnalysis} disabled={analysis === "loading"}>
                AI로 분석하기
              </Button>
            </div>

            <div className="flex min-h-[420px] flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-body-sm font-bold text-gray-950">2 · AI 태깅 결과 검수</span>
                {analysis === "done" && (
                  <span className="rounded-sm bg-primary-100 px-2.5 py-1 text-code-sm text-primary-700">AI 분석 완료</span>
                )}
              </div>

              {analysis === "idle" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2.5 rounded-md border border-dashed border-gray-200 p-8 text-center">
                  <span className="text-body-sm font-semibold text-gray-950">아직 분석 전입니다</span>
                  <span className="text-caption leading-6 text-gray-400">
                    왼쪽에 공고 제목을 입력하고 분석하면
                    <br />
                    채용 전형 태그가 자동으로 채워집니다
                  </span>
                </div>
              )}

              {analysis === "loading" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3.5">
                  <div
                    className="size-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600"
                    aria-hidden="true"
                  />
                  <span className="text-body-sm font-semibold text-gray-950">AI가 공고를 분석하고 있습니다</span>
                  <span className="text-caption text-gray-400">채용 전형 · 코딩테스트 여부 추출 중…</span>
                </div>
              )}

              {analysis === "done" && (
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex flex-col gap-2.5 rounded-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm font-bold text-gray-950">채용 전형</span>
                      <span className="text-caption text-gray-400">신뢰도 94%</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {STAGE_FILTER_OPTIONS.map((option) => (
                        <Chip
                          key={option.key}
                          selected={newStageTags.includes(option.key)}
                          onClick={() => toggleNewStageTag(option.key)}
                        >
                          {option.label}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 rounded-md border-2 border-warning-600/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm font-bold text-gray-950">코딩테스트 여부</span>
                      <span className="rounded-sm bg-warning-100 px-2 py-0.5 text-caption font-semibold text-warning-600">
                        신뢰도 52% · 확인 필요
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {(["없음", "있음"] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setNewHasCoding(option)}
                          className={cn(
                            "rounded-md px-4 py-2 text-body-sm font-semibold transition-colors",
                            newHasCoding === option
                              ? "bg-primary-600 text-white"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2.5">
                    <Button variant="secondary" size="md" onClick={() => setView("list")} fullWidth>
                      임시저장
                    </Button>
                    <Button variant="primary" size="md" onClick={publishJob} fullWidth>
                      확정하고 발행
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "jobs" && view === "applicants" && selectedJob && (
        <div className="flex flex-col gap-4">
          <button type="button" onClick={() => setView("list")} className="w-fit text-body-sm text-gray-500 hover:text-gray-700">
            ← 공고 관리
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="text-heading-3 text-gray-950">{selectedJob.title}</h1>
            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-caption font-semibold text-primary-700">
              {selectedJob.status}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white shadow-xs">
            <div className="flex gap-1 p-2">
              {(["전체", ...STATUS_OPTIONS] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "rounded-md px-3.5 py-2 text-body-sm font-semibold transition-colors",
                    statusFilter === status ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
            <span className="pr-5 text-caption text-gray-400">Match 높은 순</span>
          </div>

          {visibleApplicants.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="grid grid-cols-[1fr_90px_90px_110px_100px] gap-3.5 border-b border-gray-200 bg-gray-50 px-6 py-3 text-code-sm text-gray-400">
                <span>지원자</span>
                <span>WORK-TI</span>
                <span>MATCH</span>
                <span>지원일</span>
                <span>상태</span>
              </div>
              {visibleApplicants.map(({ applicant, matchPct, status }) => (
                <button
                  key={applicant.id}
                  type="button"
                  onClick={() => openApplicant(applicant.id)}
                  className="grid w-full grid-cols-[1fr_90px_90px_110px_100px] items-center gap-3.5 border-b border-gray-100 px-6 py-4 text-left last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-body-sm font-semibold text-gray-950">{applicant.name}</span>
                    <span className="text-caption text-gray-400">{applicant.career}</span>
                  </div>
                  <span className="text-code-sm text-gray-600">
                    {createWorkTIResultFromScores(applicant.workTIScores).code}
                  </span>
                  <span className="text-body-sm font-bold text-primary-600">{matchPct != null ? `${matchPct}%` : "-"}</span>
                  <span className="text-body-sm text-gray-500">{applicant.appliedAt}</span>
                  <span className="text-body-sm text-gray-700">{status}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-200 p-12 text-center">
              <span className="text-body-md font-bold text-gray-950">해당 상태의 지원자가 없습니다</span>
              <span className="text-body-sm text-gray-400">다른 탭을 선택해 보세요</span>
            </div>
          )}

          <p className="text-caption text-gray-400">
            Match는 참고 지표입니다. Workwity는 Match를 근거로 지원자를 자동 필터링하거나 탈락 처리하지 않습니다.
          </p>
        </div>
      )}

      {activeTab === "jobs" && view === "applicant-detail" && selectedApplicant && (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setView("applicants")}
            className="w-fit text-body-sm text-gray-500 hover:text-gray-700"
          >
            ← 지원자 리스트
          </button>

          <div className="grid gap-5 md:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-4.5">
              <div className="flex items-center gap-4.5 rounded-lg border border-gray-200 bg-white p-6 shadow-xs">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary-100 text-heading-3 font-extrabold text-primary-600">
                  {selectedApplicant.name.slice(0, 1)}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-heading-3 text-gray-950">{selectedApplicant.name}</span>
                  <span className="text-body-sm text-gray-500">{selectedApplicant.career}</span>
                </div>
                {applicantMatch && (
                  <div className="flex flex-col items-center rounded-md bg-primary-50 px-5 py-3.5">
                    <span className="text-heading-3 text-primary-600">{applicantMatch.percentage}%</span>
                    <span className="text-code-sm text-primary-600">MATCH</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4.5 rounded-lg border border-gray-200 bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-body-md font-bold text-gray-950">지원자 Work-TI</h3>
                  <span className="rounded-sm bg-primary-100 px-2.5 py-1 text-code-sm text-primary-700">{applicantCode}</span>
                </div>

                {applicantMatch && (
                  <>
                    <div className="flex flex-col gap-3.5">
                      {AXIS_ORDER.map((dimension) => (
                        <CompareAxisRow
                          key={dimension}
                          dimension={dimension}
                          detail={applicantMatch.axisDetails[dimension]}
                          primaryColor="var(--color-orbit-company)"
                          secondaryColor="var(--color-orbit-user)"
                        />
                      ))}
                    </div>
                    <div className="flex gap-3.5 text-caption text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ background: "var(--color-orbit-company)" }} />
                        우리 팀
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ background: "var(--color-orbit-user)" }} />
                        지원자
                      </span>
                    </div>
                    {applicantFit && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5 rounded-md bg-primary-50 p-4">
                          <span className="text-body-sm font-bold text-primary-700">잘 맞는 축</span>
                          {applicantFit.wellMatchedAxes.length > 0 ? (
                            applicantFit.wellMatchedAxes.map((axis) => (
                              <span key={axis} className="text-body-sm text-primary-800">
                                · {axis}
                              </span>
                            ))
                          ) : (
                            <span className="text-body-sm text-primary-800">뚜렷하게 맞는 축이 없어요</span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5 rounded-md bg-gray-50 p-4">
                          <span className="text-body-sm font-bold text-gray-600">협업 시 유의</span>
                          {applicantFit.gapAxes.length > 0 ? (
                            applicantFit.gapAxes.map((axis) => (
                              <span key={axis} className="text-body-sm text-gray-600">
                                · {axis}
                              </span>
                            ))
                          ) : (
                            <span className="text-body-sm text-gray-600">차이가 두드러진 축이 없어요</span>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <aside className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
                <span className="text-body-sm font-bold text-gray-950">전형 상태</span>
                <div className="flex flex-col gap-2">
                  {STATUS_OPTIONS.map((status) => {
                    const current = getApplicantStatus(selectedApplicant.id);
                    const isSelected = current === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => saveApplicantStatus(status)}
                        className={cn(
                          "flex items-center justify-between rounded-md px-3.5 py-2.5 text-body-sm font-semibold transition-colors",
                          isSelected
                            ? "border-2 border-primary-600 text-gray-950"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {status}
                        {isSelected && <span className="text-primary-600">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="text-caption leading-6 text-gray-400">상태를 선택하면 지원자에게 이메일이 자동 발송됩니다</p>
              </div>
            </aside>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
