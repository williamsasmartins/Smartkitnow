import React, { ReactNode } from "react";
import AdSlot from "@/components/ads/AdSlot";

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
};

export default function AdRailLayout({
  titleBlock,
  children,
  topCenterAd = true,
  bottomCenterAd = true,
  showRails = true,
}: AdRailLayoutProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      {titleBlock ? <div className="mb-6">{titleBlock}</div> : null}

      <div className="flex gap-6">
        {/* ESQUERDA */}
        {showRails ? (
          <aside className="hidden xl:block w-[160px] shrink-0">
            <div className="sticky top-24">
              <AdSlot variant="rail" size="thin" label="Ad - Left (Google AdSense)" />
            </div>
          </aside>
        ) : null}

        {/* CENTRO */}
        <div className="min-w-0 flex-1">
          {topCenterAd ? (
            <div className="mx-auto mb-6 flex justify-center">
              <AdSlot variant="banner" size="thin" label="Ad - Top Center (Google AdSense)" />
            </div>
          ) : null}

          {children}

          {bottomCenterAd ? (
            <div className="mx-auto mt-6 flex justify-center">
              <AdSlot variant="banner" size="thin" label="Ad - Bottom Center (Google AdSense)" />
            </div>
          ) : null}
        </div>

        {/* DIREITA */}
        {showRails ? (
          <aside className="hidden xl:block w-[160px] shrink-0">
            <div className="sticky top-24">
              <AdSlot variant="rail" size="thin" label="Ad - Right (Google AdSense)" />
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
