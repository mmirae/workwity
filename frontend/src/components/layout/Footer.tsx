"use client";

import { usePathname } from "next/navigation";
import { isFocusedRoute } from "@/lib/layout/focusedRoutes";

export function Footer() {
  const pathname = usePathname();
  if (isFocusedRoute(pathname)) return null;

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-8 py-8 text-body-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Workwity</span>
        <div className="flex gap-5">
          <span className="cursor-pointer hover:text-gray-700">이용약관</span>
          <span className="cursor-pointer hover:text-gray-700">개인정보처리방침</span>
        </div>
      </div>
    </footer>
  );
}
