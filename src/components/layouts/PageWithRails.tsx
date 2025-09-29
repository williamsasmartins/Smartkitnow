// src/components/layouts/PageWithRails.tsx
import React from "react";
import AdSlot from "@/components/ads/AdSlot";

type Props = {
  titleBlock?: React.ReactNode;
  children: React.ReactNode;
  showRails?: boolean;
  showTopBanner?: boolean;
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
 * - Banners Top/Bottom centralizados (320/728/970).
 * - Miolo com mesma largura dos banners (harmonia total).
 * - Rails 120px em lg/xl; 160px apenas em 2XL (>=1536px).
 */
export default function PageWithRails({
  titleBlock,
  children,
  showRails = true,
  showTopBanner = true,
  showBottomBanner = true,
  railsSticky = false, // produção segura
}: Props) {
  return (
    <div className="w-full overflow-x-hidden">
      {/* TOP BANNER */}
      {showTopBanner && (
        <div className="mt-4">
          <AdSlot variant="banner" id="pageTopBanner" label="Ad - Top Banner (Google AdSense)" />
        </div>
      )}

      {/* 3 colunas: rail | conteúdo | rail
         Rails: 120px (lg/xl) e 160px somente em 2XL */}
      <div
        className="
          mt-6
          grid grid-cols-1
          lg:grid-cols-[120px_minmax(0,1fr)_120px]
          2xl:grid-cols-[160px_minmax(0,1fr)_160px]
          gap-3 lg:gap-4
          px-2 sm:px-3 lg:px-3
        "
      >
        {/* Rail esquerdo */}
        {showRails ? (
          <div className="hidden lg:flex justify-center z-0">
            <div className={railsSticky ? "sticky top-24" : ""}>
              <AdSlot variant="rail" id="leftRail" label="Ad - Left Rail (Google AdSense)" />
            </div>
          </div>
        ) : (
          <div className="hidden lg:block" />
        )}

        {/* Miolo com mesma largura dos banners */}
        <div
          className="
            relative z-10
            mx-auto w-full
            max-w-[320px]
            sm:max-w-[728px]
            xl:max-w-[970px]
          "
        >
          {titleBlock && <div className="mb-6">{titleBlock}</div>}
          <div>{children}</div>
        </div>

        {/* Rail direito */}
        {showRails ? (
          <div className="hidden lg:flex justify-center z-0">
            <div className={railsSticky ? "sticky top-24" : ""}>
              <AdSlot variant="rail" id="rightRail" label="Ad - Right Rail (Google AdSense)" />
            </div>
          </div>
        ) : (
          <div className="hidden lg:block" />
        )}
      </div>

      {/* BOTTOM BANNER */}
      {showBottomBanner && (
        <div className="my-6">
          <AdSlot variant="banner" id="pageBottomBanner" label="Ad - Bottom Banner (Google AdSense)" />
        </div>
      )}
    </div>
  );
}
