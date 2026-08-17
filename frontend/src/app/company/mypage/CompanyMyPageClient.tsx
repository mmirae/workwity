"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createWorkTIResultFromScores } from "@/data/workti/worktiData";
import { COMPANY_WORK_TI_RESULTS } from "@/data/workti/companyWorktiData";
import { getCompanyResult } from "@/lib/company/companyStorage";
import { addCompanyJob, deleteCompanyJob, getCompanyJobs, setCompanyJobStatus } from "@/lib/company/companyJobsStorage";
import { getApplicantStatus, setApplicantStatus, type ApplicantStatus } from "@/lib/company/applicantStatusStorage";
import { SEED_APPLICANTS, type CompanyJobPosting } from "@/lib/mock/companyApplicants";
import { getHiringProcessFilterLabel, type HiringProcessFilterId } from "@/data/hiringProcessFilters";
import { requestJobAnalysis } from "@/lib/ai/jobAnalysisClient";
import { computeJobMatch } from "@/lib/workti/matchJob";
import { buildAiFitSummary } from "@/lib/workti/aiFitSummary";
import { AXIS_ORDER } from "@/lib/workti/axisMeta";
import type { StoredWorkTIResult } from "@/lib/workti/testStorage";
import { WorkTIReportCard } from "@/components/workti/WorkTIReportCard";
import { CompareAxisRow } from "@/components/workti/CompareAxisRow";
import { HiringProcessFilterEditor } from "@/components/company/HiringProcessFilterEditor";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type MainTab = "jobs" | "workti";
type JobsView = "list" | "new" | "applicants" | "applicant-detail";

const STATUS_OPTIONS: ApplicantStatus[] = ["신규", "검토중", "합격", "불합격"];

interface JobDraft {
  jobTitle: string;
  experience: string;
  employmentType: string;
  workMode: string;
  location: string;
  /** Bullet-list fields are edited as newline-joined text in a <textarea>. */
  responsibilities: string;
  requirements: string;
  preferredQualifications: string;
  hiringProcessFilterIds: HiringProcessFilterId[];
}

const EMPTY_JOB_DRAFT: JobDraft = {
  jobTitle: "",
  experience: "",
  employmentType: "",
  workMode: "",
  location: "",
  responsibilities: "",
  requirements: "",
  preferredQualifications: "",
  hiringProcessFilterIds: [],
};

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-gray-500">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-gray-300 px-3 text-body-sm text-gray-950 focus:border-primary-600 focus:outline-none focus:shadow-focus"
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-gray-500">{label}</span>
      <textarea
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y rounded-md border border-gray-300 px-3 py-2 text-body-sm leading-6 text-gray-950 focus:border-primary-600 focus:outline-none focus:shadow-focus"
      />
    </label>
  );
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
  const [jobPendingDelete, setJobPendingDelete] = useState<CompanyJobPosting | null>(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicantStatus | "전체">("전체");
  const [statusVersion, setStatusVersion] = useState(0);

  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [analysis, setAnalysis] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [draft, setDraft] = useState<JobDraft>(EMPTY_JOB_DRAFT);

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

  const updateDraft = (patch: Partial<JobDraft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const analyzeJobPosting = async () => {
    if (analysis === "loading" || !newText.trim()) return;
    setAnalysis("loading");
    setAnalysisError(null);
    try {
      const result = await requestJobAnalysis(newText);
      setDraft({
        jobTitle: result.jobTitle ?? "",
        experience: result.experience ?? "",
        employmentType: result.employmentType ?? "",
        workMode: result.workMode ?? "",
        location: result.location ?? "",
        responsibilities: result.responsibilities.join("\n"),
        requirements: result.requirements.join("\n"),
        preferredQualifications: result.preferredQualifications.join("\n"),
        hiringProcessFilterIds: result.hiringProcessFilterIds,
      });
      if (!newTitle.trim() && result.jobTitle) setNewTitle(result.jobTitle);
      setAnalysis("done");
    } catch (error) {
      setAnalysis("error");
      setAnalysisError(error instanceof Error ? error.message : "AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const toggleJobStatus = (job: CompanyJobPosting) => {
    const nextStatus = job.status === "발행중" ? "마감" : "발행중";
    setCompanyJobStatus(job.id, nextStatus);
    setJobs(getCompanyJobs());
    showToast(nextStatus === "마감" ? "공고를 마감했습니다" : "공고를 다시 열었습니다");
  };

  const confirmDeleteJob = () => {
    if (!jobPendingDelete) return;
    deleteCompanyJob(jobPendingDelete.id);
    setJobs(getCompanyJobs());
    setJobPendingDelete(null);
    showToast("공고가 삭제되었습니다");
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
      process: draft.hiringProcessFilterIds.map(getHiringProcessFilterLabel),
      postedAt: new Date().toISOString().slice(0, 10),
      hiringProcessFilterIds: draft.hiringProcessFilterIds,
      experience: draft.experience.trim() || null,
      employmentType: draft.employmentType.trim() || null,
      workMode: draft.workMode.trim() || null,
      location: draft.location.trim() || null,
      responsibilities: splitLines(draft.responsibilities),
      requirements: splitLines(draft.requirements),
      preferredQualifications: splitLines(draft.preferredQualifications),
    };
    addCompanyJob(posting);
    setJobs(getCompanyJobs());
    setNewTitle("");
    setNewText("");
    setDraft(EMPTY_JOB_DRAFT);
    setAnalysis("idle");
    setAnalysisError(null);
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
              const tagLabels = job.hiringProcessFilterIds.map(getHiringProcessFilterLabel);
              return (
                <div
                  key={job.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-xs transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  <button type="button" onClick={() => openJob(job.id)} className="flex flex-1 flex-col gap-2 text-left">
                    <div className="flex items-center gap-2.5">
                      <span className="text-body-md font-bold text-gray-950">{job.title}</span>
                      <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-caption font-semibold text-primary-700">
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tagLabels.map((label, index) => (
                        <span key={`${label}-${index}`} className="rounded-sm border border-gray-200 bg-gray-50 px-2.5 py-1 text-caption text-gray-600">
                          {label}
                        </span>
                      ))}
                    </div>
                  </button>
                  <div className="flex items-center gap-3.5">
                    <span className="text-body-sm text-gray-500">지원자 {count}명</span>
                    <button
                      type="button"
                      onClick={() => toggleJobStatus(job)}
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-caption font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      {job.status === "발행중" ? "마감" : "재오픈"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setJobPendingDelete(job)}
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-caption font-semibold text-danger-600 hover:bg-gray-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
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
                placeholder="채용 공고 전문을 붙여넣으세요. 형식은 자유입니다. 예: 우리 회사는 이런 사람을 찾고 있어요..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="resize-y rounded-md border border-gray-300 px-3.5 py-3 text-body-sm leading-6 text-gray-950 focus:border-primary-600 focus:outline-none focus:shadow-focus"
              />
              <Button variant="primary" size="md" onClick={analyzeJobPosting} disabled={analysis === "loading" || !newText.trim()}>
                AI로 공고 정리하기
              </Button>
            </div>

            <div className="flex min-h-[420px] flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-body-sm font-bold text-gray-950">2 · AI 공고 정리 결과</span>
                {analysis === "done" && (
                  <span className="rounded-sm bg-primary-100 px-2.5 py-1 text-code-sm text-primary-700">AI 분석 완료</span>
                )}
              </div>

              {analysis === "idle" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2.5 rounded-md border border-dashed border-gray-200 p-8 text-center">
                  <span className="text-body-sm font-semibold text-gray-950">아직 분석 전입니다</span>
                  <span className="text-caption leading-6 text-gray-400">
                    왼쪽에 채용 공고 원문을 입력하고 분석하면
                    <br />
                    직무 정보와 채용절차가 자동으로 정리됩니다
                  </span>
                </div>
              )}

              {analysis === "loading" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3.5">
                  <div
                    className="size-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600"
                    aria-hidden="true"
                  />
                  <span className="text-body-sm font-semibold text-gray-950">공고 내용을 정리하고 있어요…</span>
                  <span className="text-caption text-gray-400">직무 정보와 채용절차를 추출하는 중입니다</span>
                </div>
              )}

              {analysis === "error" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3.5 rounded-md border border-dashed border-danger-100 p-8 text-center">
                  <span className="text-body-sm font-semibold text-gray-950">분석에 실패했어요</span>
                  <span className="text-caption leading-6 text-gray-400">{analysisError}</span>
                  <Button variant="secondary" size="sm" onClick={analyzeJobPosting}>
                    다시 시도
                  </Button>
                </div>
              )}

              {analysis === "done" && (
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
                  <p className="text-caption leading-5 text-gray-400">
                    AI가 원문을 바탕으로 정리한 결과입니다. 등록 전에 내용을 확인하고 자유롭게 수정해 주세요.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <LabeledInput label="직무명" value={draft.jobTitle} onChange={(v) => updateDraft({ jobTitle: v })} />
                    <LabeledInput label="희망 경력" value={draft.experience} onChange={(v) => updateDraft({ experience: v })} />
                    <LabeledInput
                      label="고용 형태"
                      value={draft.employmentType}
                      onChange={(v) => updateDraft({ employmentType: v })}
                    />
                    <LabeledInput label="근무 형태" value={draft.workMode} onChange={(v) => updateDraft({ workMode: v })} />
                  </div>
                  <LabeledInput label="근무지" value={draft.location} onChange={(v) => updateDraft({ location: v })} />

                  <LabeledTextarea
                    label="주요 업무"
                    value={draft.responsibilities}
                    onChange={(v) => updateDraft({ responsibilities: v })}
                    placeholder="한 줄에 하나씩 입력해 주세요"
                  />
                  <LabeledTextarea
                    label="자격 요건"
                    value={draft.requirements}
                    onChange={(v) => updateDraft({ requirements: v })}
                    placeholder="한 줄에 하나씩 입력해 주세요"
                  />
                  <LabeledTextarea
                    label="우대 사항"
                    value={draft.preferredQualifications}
                    onChange={(v) => updateDraft({ preferredQualifications: v })}
                    placeholder="한 줄에 하나씩 입력해 주세요"
                  />

                  <div className="flex flex-col gap-2">
                    <span className="text-caption font-semibold text-gray-500">채용절차</span>
                    <HiringProcessFilterEditor
                      value={draft.hiringProcessFilterIds}
                      onChange={(ids) => updateDraft({ hiringProcessFilterIds: ids })}
                    />
                  </div>

                  <div className="mt-auto flex gap-2.5 pt-2">
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
            <button
              type="button"
              onClick={() => toggleJobStatus(selectedJob)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-caption font-semibold text-gray-600 hover:bg-gray-50"
            >
              {selectedJob.status === "발행중" ? "마감" : "재오픈"}
            </button>
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

      <Modal
        open={jobPendingDelete !== null}
        onClose={() => setJobPendingDelete(null)}
        title="이 공고를 삭제하시겠어요?"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setJobPendingDelete(null)}>
              취소
            </Button>
            <Button variant="primary" size="sm" onClick={confirmDeleteJob}>
              삭제
            </Button>
          </>
        }
      >
        삭제한 공고는 복구할 수 없습니다.
      </Modal>

      <Toast message={toast} />
    </div>
  );
}
