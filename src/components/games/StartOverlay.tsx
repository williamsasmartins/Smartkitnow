import React, { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  ariaLabel?: string;
};

export default function StartOverlay({ open, onClose, children, ariaLabel = "Close" }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.code === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-black/40"
      role="dialog"
      aria-modal="true"
      onPointerDown={onClose}
    >
      <div
        className="relative z-50 w-[min(92vw,560px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-8"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl pointer-events-none" aria-hidden />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900"
          aria-label={ariaLabel}
        >
          <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        </button>

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
