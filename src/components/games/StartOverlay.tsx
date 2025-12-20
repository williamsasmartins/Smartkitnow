import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function StartOverlay({
  open,
  onClose,
  children,
  hideFooterClose,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  hideFooterClose?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    // Focus first time so keyboard works predictably
    requestAnimationFrame(() => panelRef.current?.focus());

    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // clicking the backdrop closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-[min(92vw,760px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 md:p-8 outline-none"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl" aria-hidden />

        {/* Top-right X removed per request; use the Close button below */}

        <div className="relative">{children}</div>

        {!hideFooterClose ? (
          <div className="relative mt-6 flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
