"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MOCK_JOBS } from "@/lib/mock/jobs";
import { getApplications, type JobApplication } from "@/lib/jobs/applicationStorage";
import { getSavedJobIds, toggleSavedJob } from "@/lib/jobs/savedJobsStorage";
import { getRecentJobIds } from "@/lib/jobs/recentJobsStorage";
import { getSeekerProfile, saveSeekerProfile, type SeekerProfile } from "@/lib/profile/seekerProfileStorage";
import { Button } from "@/components/ui/Button";

function findJob(jobId: string) {
  return MOCK_JOBS.find((job) => job.id === jobId);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-7 shadow-xs">
      <h2 className="text-heading-3 text-gray-950">{title}</h2>
      {children}
    </section>
  );
}

function EmptyRow({ message, ctaLabel, ctaHref }: { message: string; ctaLabel: string; ctaHref: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-gray-200 p-8 text-center">
      <span className="text-body-sm text-gray-400">{message}</span>
      <Button variant="secondary" size="sm" href={ctaHref}>
        {ctaLabel}
      </Button>
    </div>
  );
}

function EditableField({
  label,
  placeholder,
  value,
  onSave,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onSave: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  const handleSave = () => {
    onSave(draft.trim());
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-200 p-4.5">
      <span className="text-caption text-gray-400">{label}</span>
      {editing ? (
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className="h-11 flex-1 rounded-md border border-gray-300 px-3 text-body-sm text-gray-950 focus:border-primary-600 focus:outline-none focus:shadow-focus"
            autoFocus
          />
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
              취소
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <span className={value ? "truncate text-body-md font-medium text-gray-950" : "text-body-sm text-gray-400"}>
            {value || placeholder}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 text-body-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
}

export default function MyPage() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<SeekerProfile>({});
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [recentJobIds, setRecentJobIds] = useState<string[]>([]);

  useEffect(() => {
    setProfile(getSeekerProfile());
    setApplications(getApplications());
    setSavedJobIds(getSavedJobIds());
    setRecentJobIds(getRecentJobIds());
    setReady(true);
  }, []);

  if (!ready) return null;

  const updateProfile = (patch: Partial<SeekerProfile>) => {
    const next = { ...profile, ...patch };
    setProfile(next);
    saveSeekerProfile(next);
  };

  const handleUnsave = (jobId: string) => setSavedJobIds(toggleSavedJob(jobId));

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-6 px-8 py-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-heading-2 text-gray-950">마이페이지</h1>
        <p className="text-body-sm text-gray-500">이력서와 지원 현황을 관리하세요</p>
      </div>

      <Section title="지원 자료">
        <EditableField
          label="대표 이력서"
          placeholder="이력서 링크(노션·드라이브 등)를 등록해 보세요"
          value={profile.resumeUrl}
          onSave={(resumeUrl) => updateProfile({ resumeUrl })}
        />
        <EditableField
          label="포트폴리오 URL"
          placeholder="https://..."
          value={profile.portfolioUrl}
          onSave={(portfolioUrl) => updateProfile({ portfolioUrl })}
        />
        <span className="text-caption text-gray-400">지원 시 저장된 자료를 사용하거나 새 자료를 안내할 수 있습니다</span>
      </Section>

      <Section title="지원 현황">
        {applications.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {applications
              .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
              .map((app) => {
                const job = findJob(app.jobId);
                if (!job) return null;
                return (
                  <Link
                    key={app.jobId}
                    href={`/jobs/${job.id}`}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3.5 rounded-md border border-gray-200 p-4.5 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-body-sm font-bold text-gray-950">{job.title}</span>
                      <span className="text-caption text-gray-400">
                        {job.company} · {new Date(app.appliedAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    {app.matchPctSnapshot != null && (
                      <span className="text-body-sm font-bold text-primary-600">{app.matchPctSnapshot}%</span>
                    )}
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-caption font-semibold text-primary-700">
                      지원완료
                    </span>
                  </Link>
                );
              })}
          </div>
        ) : (
          <EmptyRow message="아직 지원한 공고가 없습니다" ctaLabel="공고 보러 가기" ctaHref="/jobs" />
        )}
      </Section>

      <Section title="저장한 공고">
        {savedJobIds.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {savedJobIds.map((jobId) => {
              const job = findJob(jobId);
              if (!job) return null;
              return (
                <div
                  key={jobId}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-3.5 rounded-md border border-gray-200 p-4.5"
                >
                  <Link href={`/jobs/${job.id}`} className="flex flex-col gap-1">
                    <span className="text-body-sm font-bold text-gray-950">{job.title}</span>
                    <span className="text-caption text-gray-400">{job.company}</span>
                  </Link>
                  <span />
                  <button
                    type="button"
                    onClick={() => handleUnsave(jobId)}
                    className="text-caption font-semibold text-gray-400 underline hover:text-gray-600"
                  >
                    저장 취소
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyRow message="저장한 공고가 없습니다" ctaLabel="공고 보러 가기" ctaHref="/jobs" />
        )}
      </Section>

      <Section title="최근 본 공고">
        {recentJobIds.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {recentJobIds.map((jobId) => {
              const job = findJob(jobId);
              if (!job) return null;
              return (
                <Link
                  key={jobId}
                  href={`/jobs/${job.id}`}
                  className="rounded-full border border-gray-200 px-4 py-2 text-body-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {job.company} · {job.title}
                </Link>
              );
            })}
          </div>
        ) : (
          <span className="text-body-sm text-gray-400">최근 본 공고가 없습니다</span>
        )}
      </Section>
    </div>
  );
}
