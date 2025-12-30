import { Sparkles } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

interface StartOverlayProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  hideFooterClose?: boolean;
}

export default function StartOverlay({
  open,
  onClose,
  title,
  description,
  children,
  hideFooterClose,
}: StartOverlayProps) {
  if (!open) return null;

  const portalTarget = document.fullscreenElement ?? document.body;

  return createPortal(
    <div className="fixed inset-0 z-50 flex min-h-[100dvh] w-full items-start justify-center overflow-y-auto bg-white/90 p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm animate-in fade-in duration-200 dark:bg-slate-950/90 sm:items-center">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900/95 sm:p-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 ring-1 ring-blue-500/50 dark:bg-blue-500/10">
          <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-500" />
        </div>

        {title && (
          <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
        )}
        {description && (
          <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}

        <div className="space-y-4">{children}</div>

        {!hideFooterClose && !children && (
          <Button
            size="lg"
            className="mt-6 w-full bg-blue-600 font-bold text-white hover:bg-blue-500"
            onClick={onClose}
          >
            Start Game
          </Button>
        )}
      </div>
    </div>,
    portalTarget
  );
}
