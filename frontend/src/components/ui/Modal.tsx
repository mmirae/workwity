"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Base modal — Design System §17 (focus trap + Escape close).
 * Rendered via a portal into `document.body`: a plain `position: fixed`
 * overlay is positioned relative to the nearest ancestor that establishes a
 * containing block (any `backdrop-filter`/`filter`/`transform`), not
 * necessarily the viewport. The site Header uses `backdrop-blur`, so a modal
 * triggered from inside it would render clipped near the top of the page
 * instead of centered — the portal sidesteps that regardless of where the
 * trigger lives in the tree.
 */
export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        onKeyDown={trapFocus}
        className={cn(
          "w-full max-w-md rounded-lg bg-white p-6 shadow-md focus:outline-none",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          {title && (
            <h2 id="modal-title" className="text-heading-3 text-gray-950">
              {title}
            </h2>
          )}
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="ml-auto -m-1.5 shrink-0 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:shadow-focus"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={cn("text-body-md text-gray-700", title && "mt-4")}>{children}</div>

        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
