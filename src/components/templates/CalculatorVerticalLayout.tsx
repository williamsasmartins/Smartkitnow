import React, { ReactNode } from "react";
import AdUnit from "../AdUnit";
import ShareThisPageBox from "../ShareThisPageBox";
import SuggestionBox from "../SuggestionBox";
import LegalDisclaimer from "../LegalDisclaimer";

// ================================================================
// CONFIGURAÇÃO DOS SLOTS (pegar no .env)
// ================================================================
const SLOT_TOP_BANNER = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER || 'pending';
const SLOT_SIDEBAR = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || 'pending';
const SLOT_BOTTOM_BANNER = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM_BANNER || 'pending';

// ================================================================
// PROPS DO LAYOUT
// ================================================================
interface CalculatorVerticalLayoutProps {
  title: string;
  description?: string;
  widget: ReactNode;
  editorial: ReactNode;
  showTopBanner?: boolean;
  showSidebar?: boolean;
  showBottomBanner?: boolean;
}

// ================================================================
// LAYOUT PRINCIPAL
// ================================================================
export default function CalculatorVerticalLayout({
  title,
  description,
  widget,
  editorial,
  showTopBanner = true,
  showSidebar = true,
  showBottomBanner = true,
}: CalculatorVerticalLayoutProps) {
  return (
    <div className="skn-vertical-layout min-h-screen bg-white">
      {/* ============================================================
          SIDEBAR FLUTUANTE (Desktop Only, SEM STICKY)
          ============================================================ */}
      {showSidebar && (
        <aside className="hidden xl:block skn-floating-sidebar">
          <AdUnit 
            slot={SLOT_SIDEBAR}
            type="sidebar"
          />
        </aside>
      )}

      {/* ============================================================
          CONTAINER PRINCIPAL (Max 1200px, Centralizado)
          ============================================================ */}
      <div className="mx-auto pb-10" style={{ maxWidth: 1200 }}>
        
        {/* ========================================================
            TOP BANNER AD (Responsivo: 970×90 / 728×90 / 320×100)
            ======================================================== */}
        {showTopBanner && (
          <AdUnit 
            slot={SLOT_TOP_BANNER}
            type="top-banner"
            className="mb-6"
          />
        )}

        {/* ========================================================
            CONTEÚDO CENTRALIZADO (Max 768px)
            ======================================================== */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          {/* TÍTULO */}
          <header className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#18202b] mb-3">
              {title}
            </h1>
            {description && (
              <p className="text-base text-[#9ea7a8] leading-relaxed">
                {description}
              </p>
            )}
          </header>

          {/* WIDGET DA CALCULADORA */}
          <section 
            className="mb-8 rounded-xl overflow-hidden"
            style={{
              border: '2px solid #5c82ee',
              backgroundColor: '#ffffff'
            }}
          >
            <div className="p-6">
              {widget}
            </div>
          </section>

          {/* CONTEÚDO EDITORIAL */}
          <article className="mb-8 prose prose-lg max-w-none">
            <div 
              className="text-[#18202b]"
              style={{
                lineHeight: 1.7,
                fontSize: '16px'
              }}
            >
              {editorial}
            </div>
          </article>

          {/* BOTTOM BANNER AD */}
          {showBottomBanner && (
            <AdUnit 
              slot={SLOT_BOTTOM_BANNER}
              type="bottom-banner"
              className="mb-8"
            />
          )}

          {/* DISCLAIMER LEGAL */}
          <LegalDisclaimer />

          {/* SHARE THIS PAGE */}
          <ShareThisPageBox />

          {/* SUGGESTION BOX */}
          <SuggestionBox />
        </div>
      </div>

      {/* ============================================================
          CSS CUSTOMIZADO (Sidebar Flutuante)
          ============================================================ */}
      <style jsx>{`
        .skn-floating-sidebar {
          position: fixed;
          right: max(1rem, calc((100vw - 1200px) / 2 - 320px));
          top: 200px;
          width: 300px;
          z-index: 10;
        }

        /* Ajustes para telas muito grandes */
        @media (min-width: 1600px) {
          .skn-floating-sidebar {
            right: calc((100vw - 1200px) / 2 - 320px);
          }
        }

        /* Hide sidebar em telas menores */
        @media (max-width: 1279px) {
          .skn-floating-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
