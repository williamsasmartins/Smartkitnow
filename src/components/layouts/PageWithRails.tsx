// src/components/layouts/PageWithRails.tsx
import React from "react";
import AdSlot from "@/components/ads/AdSlot";
import RightRailAds from "@/components/ads/RightRailAds";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";

// Helper para ler metadados estáticos da página
type PageMeta = { allowAds?: boolean; minContentScore?: number };
function getPageMeta(children: any): PageMeta {
  return children?.type?.pageMeta || { allowAds: true, minContentScore: 0 };
}
function hasEnoughContent(score: number) {
  return score >= 3;
}

type Props = {
  titleBlock?: React.ReactNode;
  children: React.ReactNode;
  showRails?: boolean;
  showLeftRail?: boolean;
  showRightRail?: boolean;
  showTopBanner?: boolean;
  showMiddleBanner?: boolean;
  showBottomBanner?: boolean;
  /**
   * PRODUÇÃO (AdSense): deixe false para evitar sticky manual.
   * Use Auto ads (Anchors) no painel do AdSense se quiser banners que acompanham o scroll.
   */
  railsSticky?: boolean;
};

/**
 * Layout para listagens (categoria/subcategoria):
 * - Rails à esquerda e direita (fora do conteúdo central).
 * - Banners Top/Bottom/Middle centralizados.
 * - Miolo mais estreito para seguir a referência (linha amarela).
 * - Rails 120px em lg/xl; 160px apenas em 2XL (>=1536px).
 */
export default function PageWithRails({
  titleBlock,
  children,
  showRails = true,
  showLeftRail,
  showRightRail,
  showTopBanner = true,
  showMiddleBanner = true,
  showBottomBanner = true,
  railsSticky = true, // sticky por padrão em desktop
}: Props) {
  // Lógica AdSense: só renderiza anúncios quando há conteúdo suficiente
  const meta = getPageMeta(children);
  const canServeAds = !!meta.allowAds && hasEnoughContent(meta.minContentScore ?? 0);
  const leftRail = typeof showLeftRail === "boolean" ? showLeftRail : showRails;
  const rightRail = typeof showRightRail === "boolean" ? showRightRail : showRails;

  return (
    <div className="w-full overflow-x-hidden">
      {/* TOP BANNER */}
      {showTopBanner && canServeAds && (
        <div className="mt-4">
          <AdSlot variant="banner" id="pageTopBanner" label="Ad - Top Banner (Google AdSense)" />
        </div>
      )}

      {/* 3 colunas: rail | conteúdo | rail
         Rails: 120px (lg/xl) e 160px somente em 2XL */}
      <div
        className={`
          mt-6
          grid grid-cols-1
          ${leftRail && rightRail ? "xl:grid-cols-[160px_minmax(0,1fr)_160px]" : leftRail && !rightRail ? "xl:grid-cols-[160px_minmax(0,1fr)]" : !leftRail && rightRail ? "xl:grid-cols-[minmax(0,1fr)_160px]" : "xl:grid-cols-1"}
          gap-3 xl:gap-4
          px-0 sm:px-0 xl:px-0
          justify-items-start
        `}
      >
        {/* Rail esquerdo */}
        {leftRail ? (
          <aside className="hidden xl:block w-[160px]">
            <div className={railsSticky ? "sticky top-24 space-y-4" : "space-y-4"}>
              {canServeAds && (
                <AdSlot variant="rail" id="leftRail" label="Ad - Left Rail (Google AdSense)" />
              )}
            </div>
          </aside>
        ) : null}

        {/* Miolo mais estreito que antes para alinhar com a referência */}
        <div
          className="
            relative z-10
            w-full
            max-w-full sm:max-w-[640px] xl:max-w-[880px]
            pl-4 sm:pl-6 xl:pl-10
            pr-2 sm:pr-3 xl:pr-6
            justify-self-start
            "
        >
          {titleBlock && <div className="skn-offset-header mb-6">{titleBlock}</div>}

          {/* MIDDLE BANNER dentro do miolo */}
          {showMiddleBanner && canServeAds && (
            <div className="mb-6">
              <AdSlot variant="banner" id="pageMiddleBanner" label="Ad - Middle Banner (Google AdSense)" />
            </div>
          )}

          <main className="w-full skn-offset-header pb-16 md:pb-24"> 
            {children}
          </main>
          <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <SiteFeedbackForm title="Questions or suggestions?" compact={true} />
            <ShareThisCalculator />
          </section>
        </div>

        {/* Rail direito */}
        {rightRail ? (
          <aside className="hidden xl:block w-[160px]">
            <div className={railsSticky ? "sticky top-24 space-y-4" : "space-y-4"}>
              {canServeAds && <RightRailAds />}
            </div>
          </aside>
        ) : null}
      </div>

      {/* Bottom banner above global Footer (gated by AdSense) */}
      {canServeAds && (
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-10">
          <div className="flex justify-center">
            <div className="w-full ad-reserve-banner ad-frame">
              <AdSlot
                variant="banner"
                id="pageBottomBannerAboveFooter"
                className="w-full"
                label="Page bottom banner above footer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
