// src/components/ads/AdSlot.tsx
import React from "react";

type AdSlotProps = {
  /** rail = laterais; banner = topo/rodapé */
  variant: "rail" | "banner";
  id?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Seu client do AdSense, ex.: "ca-pub-XXXXXXXXXXXX" */
  adClient?: string;
  /** Seu slot do AdSense, ex.: "1234567890" */
  adSlot?: string;
  /** Deixar o rail fixo em desktop */
  stickyRail?: boolean;
  /** Ativar lazy loading via IntersectionObserver */
  lazy?: boolean;
  /** Formato do anúncio para banners: 'auto' (padrão) ou 'autorelaxed' (Multiplex) */
  adFormat?: "auto" | "autorelaxed";
  /** Controla data-full-width-responsive quando em banner */
  fullWidthResponsive?: boolean;
};

/**
 * Integração básica com AdSense mantendo placeholders em dev/sem configuração.
 * - Banner centralizado com larguras oficiais por breakpoint:
 *   sm: 320x100 | md: 728x90 | xl: 970x90
 * - Rail lateral: 120px em lg/xl e 160px apenas em 2XL (>=1536px).
 */
export default function AdSlot({
  variant,
  id,
  label,
  className,
  style,
  adClient,
  adSlot,
  stickyRail = false,
  lazy = true,
  adFormat = "auto",
  fullWidthResponsive = true,
}: AdSlotProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(!lazy);

  React.useEffect(() => {
    if (!lazy || typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy]);

  const canRenderAds =
    import.meta.env.PROD && typeof window !== "undefined" && !!adClient && !!adSlot;

  // Após montar um <ins>, pede render ao AdSense
  React.useEffect(() => {
    if (!canRenderAds || !inView) return;
    try {
      // @ts-expect-error Adsbygoogle is injected by AdSense script and has no TypeScript typings in our project; invoking push requests ad rendering
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silencia erros em dev/local sem configuração
    }
  }, [canRenderAds, inView]);

  // Banner variant
  if (variant === "banner") {
    return (
      <div
        ref={ref}
        className={["w-full flex justify-center", className || ""].join(" ")}
        id={id}
        aria-label={label || "Ad banner"}
        style={style}
      >
        {inView && canRenderAds ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
          />
        ) : (
          <div
            className="
              w-[320px] h-[100px]
              sm:w-[728px] sm:h-[90px]
              xl:w-[970px] xl:h-[90px]
              max-w-full
              flex items-center justify-center
              text-xs text-muted-foreground
            "
          >
            {label || (adFormat === "autorelaxed" ? "Ad - Multiplex (Google AdSense)" : "Ad - Banner (Google AdSense)")}
          </div>
        )}
      </div>
    );
  }

  // Rail variant
  return (
    <div
      ref={ref}
      id={id}
      aria-label={label || "Ad rail"}
      className={[
        stickyRail ? "md:sticky md:top-4" : "",
        "mx-auto",
        className || "",
      ].join(" ")}
      style={style}
    >
      {inView && canRenderAds ? (
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: "160px", height: "600px" }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
        />
      ) : (
        <div
          className="
            w-[160px]
            text-center text-xs text-muted-foreground
            z-0
          "
          style={{ minHeight: 600 }}
        >
          {label || "Ad - Rail (Google AdSense)"}
        </div>
      )}
    </div>
  );
}
