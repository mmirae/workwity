"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { UserRole } from "@/lib/auth/types";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";

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
      <div className="flex flex-col gap-3">
        <p className="text-body-sm text-gray-500">
          지금은 목업 로그인입니다. 실제 서비스에서는 Google · 카카오 로그인이 연결됩니다.
        </p>
        {ROLE_OPTIONS.map((option) => (
          <Card
            key={option.role}
            variant="interactive"
            onClick={() => handleSelect(option.role, option.redirectTo)}
            className="flex flex-col gap-1"
          >
            <span className="text-body-md font-semibold text-gray-950">{option.label}</span>
            <span className="text-body-sm text-gray-500">{option.description}</span>
          </Card>
        ))}
      </div>
    </Modal>
  );
}
