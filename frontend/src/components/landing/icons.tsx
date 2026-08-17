// Design System §19 — 1.5~2px line icons only, no robot/brain/circuit/rocket/planet motifs.

export function TimerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 9v4l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 2.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M15.2 8.8l-2 4.4-4.4 2 2-4.4 4.4-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OverlapCirclesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="14.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
