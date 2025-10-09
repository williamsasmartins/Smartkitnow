import React, { ReactNode } from "react";
import AdSlot from "@/components/ads/AdSlot";
import RightRailAds from "@/components/ads/RightRailAds";

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
              <AdSlot variant="rail" label="Ad - Left (Google AdSense)" />
            </div>
          </aside>
        ) : null}

        {/* CENTRO */}
        <div className="min-w-0 flex-1">
          {topCenterAd ? (
            <div className="mx-auto mb-6 flex justify-center">
              <AdSlot variant="banner" label="Ad - Top Center (Google AdSense)" />
            </div>
          ) : null}

          {children}

          {bottomCenterAd ? (
            <div className="mx-auto mt-6 flex justify-center">
              <AdSlot variant="banner" label="Ad - Bottom Center (Google AdSense)" />
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
