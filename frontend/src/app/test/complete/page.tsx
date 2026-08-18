"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateWorkTIResult, getBonusBadges } from "@/data/workti/worktiData";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getStoredAnswers, saveResult } from "@/lib/workti/testStorage";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type Stage = "loading" | "login";

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
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-gray-500">
            테스트 응답은 저장되어 있습니다. 계속하면 나의 Work-TI 결과를 확인할 수 있습니다.
          </p>
          <Button variant="primary" size="lg" onClick={handleMockLogin} fullWidth>
            구직자로 계속하기
          </Button>
          <p className="text-caption text-gray-400">
            현재는 데모 버전으로, 실제 로그인 없이 결과를 확인할 수 있습니다.
          </p>
        </div>
      </Modal>
    </div>
  );
}
