import { ReactNode } from "react";
import AdSlot from "@/components/ads/AdSlot";
import RightRailAds from "@/components/ads/RightRailAds";

const ENV: any = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
const ADSENSE_CLIENT_ID =
  ENV.VITE_ADSENSE_CLIENT_ID ?? ENV.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
const SLOT_TOP_BANNER =
  ENV.VITE_ADSENSE_SLOT_TOP_BANNER ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER ?? "";
const SLOT_BOTTOM_BANNER =
  ENV.VITE_ADSENSE_SLOT_BOTTOM_BANNER ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM_BANNER ?? "";
const SLOT_SIDEBAR =
  ENV.VITE_ADSENSE_SLOT_SIDEBAR ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "";

type AdRailLayoutProps = {
  /** cabeçalho/título da página (back + h1 etc.) */
  titleBlock?: ReactNode;
  /** conteúdo principal (grid/cards/conteúdo) */
  children: ReactNode;

  /** mostra banner fino central no topo do conteúdo */
  topCenterAd?: boolean;
  /** mostra banner fino central no fim do conteúdo */
  bottomCenterAd?: boolean;

  /** mostra as duas laterais (rails) */
  showRails?: boolean;
  /** controla rail esquerdo */
  showLeftRail?: boolean;
  /** controla rail direito */
  showRightRail?: boolean;
  /** classes extras para ajustar espaçamentos do container */
  className?: string;
};

export default function AdRailLayout({
  titleBlock,
  children,
  topCenterAd = true,
  bottomCenterAd = true,
  showRails = true,
  showLeftRail,
  showRightRail,
  className,
}: AdRailLayoutProps) {
  const leftEnabled = showRails && (showLeftRail ?? true);
  const rightEnabled = showRails && (showRightRail ?? true);

  return (
    <section className={`container mx-auto px-4 py-8 ${className ?? ""}`}>
      {titleBlock ? <div className="mb-6">{titleBlock}</div> : null}

      <div className="flex gap-6">
        {/* ESQUERDA */}
        {leftEnabled ? (
          <aside className="hidden lg:block w-[160px] shrink-0">
            <div className="sticky top-24">
              <AdSlot
                variant="rail"
                label="Ad - Left (Google AdSense)"
                adClient={ADSENSE_CLIENT_ID}
                adSlot={SLOT_SIDEBAR}
              />
            </div>
          </aside>
        ) : null}

        {/* CENTRO */}
        <div className="min-w-0 flex-1">
          {topCenterAd ? (
            <div className="mx-auto mb-6 flex justify-center">
              <AdSlot
                variant="banner"
                label="Ad - Top Center (Google AdSense)"
                adClient={ADSENSE_CLIENT_ID}
                adSlot={SLOT_TOP_BANNER}
              />
            </div>
          ) : null}

          {children}

          {bottomCenterAd ? (
            <div className="mx-auto mt-6 flex justify-center">
              <AdSlot
                variant="banner"
                label="Ad - Bottom Center (Google AdSense)"
                adClient={ADSENSE_CLIENT_ID}
                adSlot={SLOT_BOTTOM_BANNER}
              />
            </div>
          ) : null}
        </div>

        {/* DIREITA */}
        {rightEnabled ? (
          <aside className="hidden lg:block w-[160px] shrink-0">
            <div className="sticky top-24">
              <RightRailAds />
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
