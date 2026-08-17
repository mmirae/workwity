"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { UserRole } from "@/lib/auth/types";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { RoleLoginModal } from "@/components/layout/RoleLoginModal";
import { isFocusedRoute } from "@/lib/layout/focusedRoutes";
import {
  getCompanyResultSnapshot,
  getCompanyStorageServerSnapshot,
  subscribeToCompanyStorage,
} from "@/lib/company/companyStorage";

interface NavItem {
  label: string;
  href: string;
}

// Design System §12 — 2~3 items per role, kept intentionally short.
// "Work-TI" (guest) and "기업 Work-TI" (company) hrefs are placeholders here —
// both are resolved per-render below (guest always to the seeker/company
// picker; company to onboarding or its saved result, whichever applies).
const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  guest: [
    { label: "서비스 소개", href: "/about" },
    { label: "공고 찾기", href: "/jobs" },
    { label: "Work-TI", href: "/test/start" },
  ],
  seeker: [
    { label: "서비스 소개", href: "/about" },
    { label: "공고 찾기", href: "/jobs" },
    { label: "내 Work-TI", href: "/me" },
  ],
  company: [
    { label: "서비스 소개", href: "/about" },
    { label: "채용 관리", href: "/company/mypage" },
    { label: "기업 Work-TI", href: "/company/onboarding" },
  ],
};

const PROFILE_MENU: Record<"seeker" | "company", { label: string; href: string }> = {
  seeker: { label: "마이페이지", href: "/mypage" },
  company: { label: "기업 마이페이지", href: "/company/mypage" },
};

export function Header() {
  const { role, isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // SSR-safe one-time read of the company result (see companyStorage.ts) —
  // avoids the hydration-mismatch/setState-in-effect issues a plain
  // `useEffect` + `useState` read would have here.
  const companyResult = useSyncExternalStore(
    subscribeToCompanyStorage,
    getCompanyResultSnapshot,
    getCompanyStorageServerSnapshot
  );

  const navItems =
    role === "company"
      ? NAV_ITEMS.company.map((item) =>
          item.label === "기업 Work-TI"
            ? { ...item, href: companyResult ? "/company/result" : "/company/onboarding" }
            : item
        )
      : NAV_ITEMS[role];
  const profileMenu = role !== "guest" ? PROFILE_MENU[role] : null;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  if (isFocusedRoute(pathname)) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-8">
        <div className="flex items-center gap-9">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-[26px] items-center justify-center rounded-[8px] bg-primary-600 text-[14px] font-extrabold text-white">
              W
            </span>
            <span className="text-[17px] font-extrabold tracking-tight text-gray-950">Workwity</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-body-sm font-semibold transition-colors",
                    isActive ? "text-primary-600" : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn && profileMenu ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-label="계정 메뉴"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="flex size-[34px] items-center justify-center rounded-full border border-gray-200 bg-primary-100 text-body-sm font-bold text-primary-600 transition-colors focus-visible:outline-none focus-visible:shadow-focus"
              >
                {role === "seeker" ? "구" : "기"}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-[44px] min-w-[186px] rounded-lg border border-gray-200 bg-white p-1.5 shadow-md">
                  <Link
                    href={profileMenu.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-body-sm text-gray-900 hover:bg-gray-100"
                  >
                    {profileMenu.label}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-2 text-left text-body-sm text-gray-500 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setLoginModalOpen(true)}>
              로그인
            </Button>
          )}
        </div>
      </div>

      <RoleLoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </header>
  );
}
