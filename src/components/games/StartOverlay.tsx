import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl text-center">
        
        {/* Decorative Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/50">
          <Sparkles className="h-8 w-8 text-blue-500" />
        </div>

        {/* Title & Desc */}
        {title && (
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-slate-400 mb-6 leading-relaxed">
            {description}
          </p>
        )}

        {/* Dynamic Content (Difficulty Buttons, etc) */}
        <div className="space-y-4">
          {children}
        </div>

        {/* Fallback Close Button */}
        {!hideFooterClose && !children && (
          <Button 
            size="lg" 
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold" 
            onClick={onClose}
          >
            Start Game
          </Button>
        )}
      </div>
    </div>
  );
}