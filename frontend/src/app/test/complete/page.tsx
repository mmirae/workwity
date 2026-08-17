"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateWorkTIResult, getBonusBadges } from "@/data/workti/worktiData";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getStoredAnswers, saveResult } from "@/lib/workti/testStorage";
import { Modal } from "@/components/ui/Modal";

type Stage = "loading" | "login";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <path
        fill="#FEE500"
        d="M9 2.4C4.9 2.4 1.6 5.02 1.6 8.26c0 2.06 1.36 3.87 3.42 4.92-.15.55-.54 2-.62 2.32-.1.38.14.38.29.27.12-.08 1.93-1.31 2.72-1.85.51.08 1.04.11 1.59.11 4.1 0 7.4-2.62 7.4-5.86 0-3.25-3.3-5.87-7.4-5.87Z"
      />
    </svg>
  );
}

export default function TestCompletePage() {
  const router = useRouter();
  const { login } = useAuth();
  const [stage, setStage] = useState<Stage>("loading");

  useEffect(() => {
    const { main, bonus } = getStoredAnswers();

    let result: ReturnType<typeof calculateWorkTIResult>;
    try {
      result = calculateWorkTIResult(main);
    } catch {
      router.replace("/test");
      return;
    }

    const badges = getBonusBadges(bonus, false);

    saveResult({
      code: result.code,
      scores: result.scores,
      axes: result.axes,
      bonusBadges: badges,
    });

    const timer = window.setTimeout(() => setStage("login"), 1200);
    return () => window.clearTimeout(timer);
  }, [router]);

  const handleMockLogin = () => {
    login("seeker");
    router.push("/me");
  };

  return (
    <div className="flex flex-1 items-center justify-center px-8 py-16">
      {stage === "loading" && (
        <div className="flex flex-col items-center gap-4.5">
          <div
            className="size-11 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600"
            aria-hidden="true"
          />
          <p className="text-body-lg font-bold text-gray-950">당신의 Work-TI를 분석하고 있어요</p>
          <p className="text-body-sm text-gray-500">4개 축과 조직 언어 취향을 계산하는 중입니다</p>
        </div>
      )}

      <Modal open={stage === "login"} onClose={() => {}} title="결과를 저장하고 확인하기">
        <div className="flex flex-col gap-3">
          <p className="text-body-sm text-gray-500">
            테스트 응답은 이미 저장되어 있습니다. 로그인하면 WORK-TI REPORT를 확인할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={handleMockLogin}
            className="flex items-center justify-center gap-2.5 rounded-md border border-gray-200 bg-white py-3 text-body-sm font-semibold text-gray-950 transition-colors hover:bg-gray-50"
          >
            <GoogleIcon />
            Google로 계속하기
          </button>
          <button
            type="button"
            onClick={handleMockLogin}
            className="flex items-center justify-center gap-2.5 rounded-md border border-gray-200 bg-white py-3 text-body-sm font-semibold text-gray-950 transition-colors hover:bg-gray-50"
          >
            <KakaoIcon />
            카카오로 계속하기
          </button>
        </div>
      </Modal>
    </div>
  );
}
