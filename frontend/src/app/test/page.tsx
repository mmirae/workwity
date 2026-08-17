"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BONUS_QUESTIONS, WORK_TI_QUESTIONS } from "@/data/workti/worktiData";
import { getStoredAnswers } from "@/lib/workti/testStorage";

const ALL_QUESTION_IDS = [...WORK_TI_QUESTIONS, ...BONUS_QUESTIONS].map((q) => q.id);

/** Resumes at the first unanswered question, or starts fresh at Q1. */
export default function TestEntryPage() {
  const router = useRouter();

  useEffect(() => {
    const { main, bonus } = getStoredAnswers();
    const answered: Record<number, string | undefined> = { ...main, ...bonus };
    const firstUnansweredId = ALL_QUESTION_IDS.find((id) => !answered[id]);
    router.replace(`/test/${firstUnansweredId ?? ALL_QUESTION_IDS[0]}`);
  }, [router]);

  return null;
}
