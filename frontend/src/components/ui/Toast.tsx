"use client";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-950 px-4.5 py-2.5 text-body-sm text-white shadow-md"
    >
      {message}
    </div>
  );
}
