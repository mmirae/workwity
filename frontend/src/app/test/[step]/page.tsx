"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BONUS_QUESTIONS,
  WORK_TI_QUESTIONS,
  type BonusOptionLabel,
  type MainTraitCode,
} from "@/data/workti/worktiData";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionCard } from "@/components/workti/QuestionCard";
import { getStoredAnswers, saveBonusAnswer, saveMainAnswer } from "@/lib/workti/testStorage";
import { AXIS_FULL_LABEL } from "@/lib/workti/axisMeta";

const TOTAL_STEPS = WORK_TI_QUESTIONS.length + BONUS_QUESTIONS.length;

export default function TestStepPage() {
  const params = useParams<{ step: string }>();
  const router = useRouter();
  const stepId = Number(params.step);

  const mainQuestion = WORK_TI_QUESTIONS.find((q) => q.id === stepId);
  const bonusQuestion = BONUS_QUESTIONS.find((q) => q.id === stepId);
  const question = mainQuestion ?? bonusQuestion;

  const [selectedLabel, setSelectedLabel] = useState<"A" | "B" | undefined>(undefined);

  useEffect(() => {
    if (!question) return;
    const { main, bonus } = getStoredAnswers();
    if (mainQuestion) {
      const code = main[stepId];
      setSelectedLabel(mainQuestion.options.find((o) => o.code === code)?.label);
    } else {
      setSelectedLabel(bonus[stepId]);
    }
  }, [stepId, question, mainQuestion]);

  useEffect(() => {
    if (!question && Number.isFinite(stepId)) {
      router.replace("/test");
    }
  }, [question, stepId, router]);

  if (!question) return null;

  const tag = mainQuestion
    ? `Q${stepId} · ${AXIS_FULL_LABEL[mainQuestion.dimension]}`
    : `Q${stepId} · 조직 언어 문화`;

  const handleSelect = (label: "A" | "B") => {
    if (mainQuestion) {
      const code = mainQuestion.options.find((o) => o.label === label)!.code as MainTraitCode;
      saveMainAnswer(stepId, code);
    } else if (bonusQuestion) {
      saveBonusAnswer(stepId, label as BonusOptionLabel);
    }
    setSelectedLabel(label);

    const nextStep = stepId + 1;
    if (nextStep > TOTAL_STEPS) {
      router.push("/test/complete");
    } else {
      router.push(`/test/${nextStep}`);
    }
  };

  const handlePrev = () => {
    if (stepId > 1) router.push(`/test/${stepId - 1}`);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[900px] items-center gap-4 px-8 py-4">
          <ProgressBar current={stepId} total={TOTAL_STEPS} className="flex-1" />
          <Link href="/" className="text-body-sm text-gray-400 hover:text-gray-600">
            나가기
          </Link>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-8 py-14">
        <div className="flex w-full max-w-[760px] flex-col items-center gap-4">
          <QuestionCard
            tag={tag}
            question={question.question}
            options={question.options}
            selectedLabel={selectedLabel}
            onSelect={handleSelect}
          />

          <div className="mt-3.5 flex w-full items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={stepId <= 1}
              className="rounded-md border border-gray-200 bg-white px-4.5 py-2.5 text-body-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-0"
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
