"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { UserRole } from "@/lib/auth/types";
import { Modal } from "@/components/ui/Modal";

interface RoleLoginModalProps {
  open: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS: Array<{ role: Exclude<UserRole, "guest">; label: string; description: string; redirectTo: string }> = [
  {
    role: "seeker",
    label: "구직자로 계속하기",
    description: "Work-TI 결과와 맞춤 공고를 확인합니다",
    redirectTo: "/me",
  },
  {
    role: "company",
    label: "기업으로 계속하기",
    description: "공고를 등록하고 지원자를 관리합니다",
    redirectTo: "/company/mypage",
  },
];

/**
 * Stand-in for real auth (Supabase + OAuth). Picking a role here just writes
 * it to the mock AuthProvider — swap `login()`'s internals later without
 * touching this component's UI.
 */
export function RoleLoginModal({ open, onClose }: RoleLoginModalProps) {
  const { login } = useAuth();
  const router = useRouter();

  const handleSelect = (role: Exclude<UserRole, "guest">, redirectTo: string) => {
    login(role);
    onClose();
    router.push(redirectTo);
  };

  return (
    <Modal open={open} onClose={onClose} title="로그인">
      <div className="flex flex-col gap-4">
        <p className="text-body-sm text-gray-500">이용할 서비스를 선택해주세요.</p>
        <div className="flex flex-col gap-3">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.role}
              type="button"
              onClick={() => handleSelect(option.role, option.redirectTo)}
              className="flex flex-col gap-1 rounded-md border border-gray-300 bg-white p-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 focus-visible:outline-none focus-visible:shadow-focus"
            >
              <span className="text-body-md font-semibold text-gray-950">{option.label}</span>
              <span className="text-body-sm text-gray-500">{option.description}</span>
            </button>
          ))}
        </div>
        <p className="text-caption text-gray-400">
          현재는 데모 버전으로, 실제 로그인 없이 서비스를 체험할 수 있습니다.
        </p>
      </div>
    </Modal>
  );
}
