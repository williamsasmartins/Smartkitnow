import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function StartOverlay({ open, onClose, children }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      const btn = panelRef.current?.querySelector<HTMLButtonElement>("[data-close]");
      btn?.focus();
    });
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // clicar fora do painel fecha
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div
        ref={panelRef}
        className="relative z-10 w-[min(92vw,720px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 md:p-8"
      >
        <div
          className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <Button
          data-close
          type="button"
          variant="outline"
          className="absolute right-4 top-4 h-9 w-9 p-0"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
