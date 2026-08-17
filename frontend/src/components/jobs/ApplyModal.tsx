"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type Phase = "form" | "submitting" | "done";

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  company: string;
  jobTitle: string;
  matchPct?: number;
  onSubmitted: (shareReport: boolean) => void;
}

export function ApplyModal({ open, onClose, company, jobTitle, matchPct, onSubmitted }: ApplyModalProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("form");
  const [shareReport, setShareReport] = useState(true);

  useEffect(() => {
    if (open) setPhase("form");
  }, [open]);

  const handleSubmit = () => {
    setPhase("submitting");
    window.setTimeout(() => {
      setPhase("done");
      onSubmitted(shareReport);
    }, 900);
  };

  if (phase === "form") {
    return (
      <Modal open={open} onClose={onClose} title="지원하시겠어요?">
        <div className="flex flex-col gap-4.5">
          <div className="flex items-center justify-between gap-4 rounded-md bg-gray-50 p-4.5">
            <div className="flex flex-col gap-1">
              <span className="text-caption text-gray-500">{company}</span>
              <span className="text-body-md font-bold text-gray-950">{jobTitle}</span>
            </div>
            {matchPct != null && (
              <div className="flex flex-col items-center">
                <span className="text-heading-3 text-primary-600">{matchPct}%</span>
                <span className="text-code-sm text-primary-600">MATCH</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-body-sm font-semibold text-gray-950">제출 서류</span>
            <div className="rounded-md border border-dashed border-gray-200 p-4.5 text-center text-body-sm text-gray-500">
              이력서 파일 업로드 또는 링크 첨부
            </div>
            <label className="flex items-center gap-2.5 text-body-sm text-gray-700">
              <input
                type="checkbox"
                checked={shareReport}
                onChange={(e) => setShareReport(e.target.checked)}
                className="size-4 rounded border-gray-300 accent-primary-600"
              />
              내 WORK-TI REPORT 함께 전달하기
            </label>
          </div>

          <div className="flex gap-2.5">
            <Button variant="secondary" size="md" onClick={onClose} fullWidth>
              취소
            </Button>
            <Button variant="primary" size="md" onClick={handleSubmit} fullWidth>
              지원 제출하기
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (phase === "submitting") {
    return (
      <Modal open={open} onClose={() => {}} title="">
        <div className="flex flex-col items-center gap-3.5 py-4">
          <div
            className="size-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600"
            aria-hidden="true"
          />
          <span className="text-body-sm font-semibold text-gray-950">지원서를 제출하고 있습니다…</span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="">
      <div className="flex flex-col items-center gap-3.5">
        <div className="flex size-13 items-center justify-center rounded-full bg-primary-50 text-heading-3 text-primary-600">
          ✓
        </div>
        <h3 className="text-heading-3 text-gray-950">지원이 완료되었습니다</h3>
        <p className="text-center text-body-sm leading-6 text-gray-500">
          결과는 이메일과 마이페이지로 안내됩니다
        </p>
        <div className="mt-1 flex w-full gap-2.5">
          <Button variant="secondary" size="md" onClick={() => router.push("/mypage")} fullWidth>
            지원 현황 보기
          </Button>
          <Button variant="primary" size="md" onClick={() => router.push("/jobs")} fullWidth>
            다른 공고 보기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
