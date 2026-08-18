"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  COMPANY_BONUS_QUESTIONS,
  COMPANY_WORK_TI_QUESTIONS,
  calculateCompanyWorkTIResult,
  getCompanyBonusBadges,
  type CompanyBonusAnswers,
  type CompanyMainAnswers,
  type BonusOptionLabel,
  type MainTraitCode,
} from "@/data/workti/companyWorktiData";
import { useAuth } from "@/lib/auth/AuthProvider";
import { saveCompanyProfile, saveCompanyResult, type CompanyProfile } from "@/lib/company/companyStorage";
import { AXIS_FULL_LABEL } from "@/lib/workti/axisMeta";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionCard } from "@/components/workti/QuestionCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const TOTAL_STEPS = COMPANY_WORK_TI_QUESTIONS.length + COMPANY_BONUS_QUESTIONS.length;
const SIZE_OPTIONS = ["1~10명", "11~50명", "51~200명", "200명 이상"];
const INDUSTRY_OPTIONS = ["IT · 소프트웨어", "핀테크", "커머스", "기타"];

type Phase = "info" | "test" | "loading" | "login";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-body-sm font-semibold text-gray-950">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "h-11 rounded-md border border-gray-300 px-3.5 text-body-sm text-gray-950 focus:border-primary-600 focus:outline-none focus:shadow-focus";

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [phase, setPhase] = useState<Phase>("info");
  const [form, setForm] = useState<Partial<CompanyProfile>>({
    size: SIZE_OPTIONS[0],
    industry: INDUSTRY_OPTIONS[0],
  });
  const [nameError, setNameError] = useState(false);

  const [testIndex, setTestIndex] = useState(0);
  const [mainAnswers, setMainAnswers] = useState<CompanyMainAnswers>({});
  const [bonusAnswers, setBonusAnswers] = useState<CompanyBonusAnswers>({});

  const handleStartTest = () => {
    if (!form.name?.trim()) {
      setNameError(true);
      return;
    }
    saveCompanyProfile({
      name: form.name.trim(),
      registrationNumber: form.registrationNumber?.trim(),
      size: form.size ?? SIZE_OPTIONS[0],
      industry: form.industry ?? INDUSTRY_OPTIONS[0],
      intro: form.intro?.trim(),
    });
    setPhase("test");
  };

  const finishTest = (finalMain: CompanyMainAnswers, finalBonus: CompanyBonusAnswers) => {
    setPhase("loading");
    const result = calculateCompanyWorkTIResult(finalMain);
    const badges = getCompanyBonusBadges(finalBonus, false);
    saveCompanyResult({ code: result.code, scores: result.scores, axes: result.axes, bonusBadges: badges });
    window.setTimeout(() => setPhase("login"), 1200);
  };

  const handleMockLogin = () => {
    login("company");
    router.push("/company/result");
  };

  const isMainQuestion = testIndex < COMPANY_WORK_TI_QUESTIONS.length;
  const mainQuestion = isMainQuestion ? COMPANY_WORK_TI_QUESTIONS[testIndex] : undefined;
  const bonusQuestion = !isMainQuestion
    ? COMPANY_BONUS_QUESTIONS[testIndex - COMPANY_WORK_TI_QUESTIONS.length]
    : undefined;

  const handleSelect = (label: "A" | "B") => {
    let nextMain = mainAnswers;
    let nextBonus = bonusAnswers;

    if (mainQuestion) {
      const code = mainQuestion.options.find((o) => o.label === label)!.code as MainTraitCode;
      nextMain = { ...mainAnswers, [mainQuestion.id]: code };
      setMainAnswers(nextMain);
    } else if (bonusQuestion) {
      nextBonus = { ...bonusAnswers, [bonusQuestion.id]: label as BonusOptionLabel };
      setBonusAnswers(nextBonus);
    }

    const nextIndex = testIndex + 1;
    if (nextIndex >= TOTAL_STEPS) {
      finishTest(nextMain, nextBonus);
    } else {
      setTestIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    if (testIndex === 0) {
      setPhase("info");
    } else {
      setTestIndex((i) => i - 1);
    }
  };

  if (phase === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center px-8 py-16">
        <div className="flex flex-col items-center gap-4.5">
          <div
            className="size-11 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600"
            aria-hidden="true"
          />
          <p className="text-body-lg font-bold text-gray-950">팀 Work-TI를 분석하고 있어요</p>
          <p className="text-body-sm text-gray-500">응답을 바탕으로 조직의 Work Identity를 계산하는 중입니다</p>
        </div>
      </div>
    );
  }

  if (phase === "login") {
    return (
      <div className="flex flex-1 items-center justify-center px-8 py-16">
        <Modal open onClose={() => {}} title="결과를 저장하고 확인하기">
          <div className="flex flex-col gap-4">
            <p className="text-body-sm text-gray-500">
              테스트 응답은 저장되어 있습니다. 계속하면 우리 팀의 Work-TI 결과를 확인할 수 있습니다.
            </p>
            <Button variant="primary" size="lg" onClick={handleMockLogin} fullWidth>
              기업으로 계속하기
            </Button>
            <p className="text-caption text-gray-400">
              현재는 데모 버전으로, 실제 로그인 없이 결과를 확인할 수 있습니다.
            </p>
          </div>
        </Modal>
      </div>
    );
  }

  if (phase === "test") {
    const tag = mainQuestion
      ? `Q${testIndex + 1} · ${AXIS_FULL_LABEL[mainQuestion.dimension]}`
      : `Q${testIndex + 1} · 조직 언어 문화`;
    const options = mainQuestion ? mainQuestion.options : bonusQuestion!.options;
    const selectedLabel = mainQuestion
      ? mainQuestion.options.find((o) => o.code === mainAnswers[mainQuestion.id])?.label
      : bonusAnswers[bonusQuestion!.id];

    return (
      <div className="flex flex-1 flex-col">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-[900px] items-center gap-4 px-8 py-4">
            <ProgressBar current={testIndex + 1} total={TOTAL_STEPS} className="flex-1" />
            <button type="button" onClick={() => router.push("/")} className="text-body-sm text-gray-400 hover:text-gray-600">
              나가기
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-8 py-14">
          <div className="flex w-full max-w-[760px] flex-col items-center gap-4">
            <QuestionCard
              tag={tag}
              question={mainQuestion ? mainQuestion.question : bonusQuestion!.question}
              perspectiveNote="우리 팀이 일하는 방식 관점으로 답해주세요"
              options={options}
              selectedLabel={selectedLabel}
              onSelect={handleSelect}
            />
            <div className="mt-3.5 flex w-full items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-md border border-gray-200 bg-white px-4.5 py-2.5 text-body-sm text-gray-600 hover:bg-gray-50"
              >
                ← 이전
              </button>
              <span className="text-body-sm text-gray-400">선택하면 자동으로 다음 문항으로 넘어갑니다</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[820px] flex-col gap-6 px-8 py-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-heading-2 text-gray-950">기업 등록</h1>
        <p className="text-body-sm text-gray-500">회사 정보를 입력하고, 팀이 일하는 방식을 등록합니다</p>
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary-600 text-caption font-bold text-white">
            1
          </span>
          <span className="text-body-sm font-bold text-gray-950">회사 정보</span>
        </div>
        <div className="h-0.5 flex-1 rounded-full bg-gray-200" />
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-caption font-bold text-gray-400">
            2
          </span>
          <span className="text-body-sm text-gray-400">팀 Work-TI · 30문항</span>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-lg border border-gray-200 bg-white p-8 shadow-xs">
        <div className="grid gap-4.5 sm:grid-cols-2">
          <Field label="회사명">
            <input
              type="text"
              placeholder="예: 토스트랩"
              value={form.name ?? ""}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                setNameError(false);
              }}
              className={inputClass}
            />
            {nameError && <span className="text-caption text-danger-600">회사명을 입력해 주세요</span>}
          </Field>
          <Field label="사업자등록번호">
            <input
              type="text"
              placeholder="000-00-00000"
              value={form.registrationNumber ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, registrationNumber: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="규모">
            <select
              value={form.size}
              onChange={(e) => setForm((prev) => ({ ...prev, size: e.target.value }))}
              className={inputClass}
            >
              {SIZE_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="산업">
            <select
              value={form.industry}
              onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))}
              className={inputClass}
            >
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="회사 소개 (선택)">
          <textarea
            rows={3}
            placeholder="어떤 팀인지 짧게 알려주세요"
            value={form.intro ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, intro: e.target.value }))}
            className="resize-y rounded-md border border-gray-300 px-3.5 py-3 text-body-sm text-gray-950 focus:border-primary-600 focus:outline-none focus:shadow-focus"
          />
        </Field>

        <div className="flex gap-3 rounded-md bg-primary-50 p-4.5">
          <p className="text-body-sm leading-6 text-primary-800">
            다음 단계에서 진행하는 팀 Work-TI 결과는 이 회사가 등록하는{" "}
            <strong className="font-bold">모든 공고의 기본 성향값</strong>이 됩니다. 실제 팀이 일하는 방식대로
            응답해 주세요.
          </p>
        </div>

        <div className="flex gap-3 rounded-md border border-gray-200 bg-gray-50 p-4.5">
          <p className="text-body-sm leading-6 text-gray-600">
            <strong className="font-bold text-gray-950">좋은 조직과 나쁜 조직을 나누는 테스트가 아닙니다.</strong>{" "}
            이상적인 모습을 고르기보다, 현재 팀에서 실제로 더 자주 일어나는 방식을 선택해 주세요.
          </p>
        </div>

        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" size="md" href="/">
            취소
          </Button>
          <Button variant="primary" size="md" onClick={handleStartTest}>
            다음 · 팀 Work-TI 시작 →
          </Button>
        </div>
      </div>
    </div>
  );
}
