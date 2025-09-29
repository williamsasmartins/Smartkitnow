// src/components/ads/AdSlot.tsx
import React from "react";

type AdSlotProps = {
  /** rail = laterais; banner = topo/rodapé */
  variant: "rail" | "banner";
  id?: string;
  label?: string;
};

/**
 * Placeholder preparado para AdSense.
 * - Banner centralizado com larguras oficiais por breakpoint:
 *   sm: 320x100 | md: 728x90 | xl: 970x90
 * - Rail lateral: 120px em lg/xl e 160px apenas em 2XL (>=1536px).
 *   Mantém UX e evita overflow em telas comuns.
 */
export default function AdSlot({ variant, id, label }: AdSlotProps) {
  if (variant === "banner") {
    return (
      <div className="w-full flex justify-center" id={id} aria-label={label || "Ad banner"}>
        <div
          className="
            w-[320px] h-[100px]
            sm:w-[728px] sm:h-[90px]
            xl:w-[970px] xl:h-[90px]
            max-w-full
            rounded-lg border border-border/50 bg-muted/30
            flex items-center justify-center
            text-xs text-muted-foreground
          "
        >
          {label || "Ad - Banner (Google AdSense)"}
        </div>
      </div>
    );
  }

  // Rails laterais (estreitos por padrão; mais largos só em telas 2XL)
  return (
    <div
      id={id}
      aria-label={label || "Ad rail"}
      className="
        mx-auto
        w-[120px] 2xl:w-[160px]
        rounded-lg border border-border/50 bg-muted/30
        text-center text-xs text-muted-foreground
        p-2
        z-0
      "
      style={{ minHeight: 600 }}
    >
      {label || "Ad - Rail (Google AdSense)"}
    </div>
  );
}
