import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AdSlot from "@/components/ads/AdSlot";
import RightRailAds from "@/components/ads/RightRailAds";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Section } from "@/data/categorySections";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CalculatorListBlue from "@/components/common/CalculatorListBlue";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import { useTheme } from "next-themes";

export type CategoryPageTemplateProps = {
  title: string;
  intro?: React.ReactNode;
  sections: Section[];
  /** Mostrar banner topo (desktop e mobile). */
  showTopBanner?: boolean;
  /** Rail direita sticky apenas em desktop (lg+). */
  showRightRail?: boolean;
  /** Conteúdo recomendado ao final da página (opcional). */
  recommendedFooter?: React.ReactNode;
  /** Cor de fundo entre Header e Footer (apenas conteúdo). */
  contentBackgroundColor?: string;
  /** Contagem adicional de itens (quando a página renderiza listas extras além de sections). */
  additionalItemCount?: number;
};

export default function CategoryPageTemplate({
  title,
  intro,
  sections,
  showTopBanner = true,
  showRightRail = true,
  recommendedFooter,
  contentBackgroundColor,
  additionalItemCount,
}: CategoryPageTemplateProps) {
  // Estado para controlar o clamp e o botão Read More
  const [introExpanded, setIntroExpanded] = React.useState(false);
  const navigate = useNavigate();
  const totalCount = React.useMemo(() => sections.reduce((sum, s) => sum + s.items.length, 0) + (additionalItemCount ?? 0), [sections, additionalItemCount]);
  const { resolvedTheme } = useTheme();
  const darkBgStyle = (resolvedTheme === "dark" && contentBackgroundColor) ? { backgroundColor: contentBackgroundColor } : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {contentBackgroundColor ? (
        <div style={darkBgStyle} className="mt-0">
          <main className="pt-0">
            {/* Top banner (90px) */}
            {showTopBanner && (
              <div className="container mx-auto px-4">
                <div className="mb-4 h-[90px] flex items-center justify-center">
                  <AdSlot variant="banner" label="Ad - Top Banner (Google AdSense)" />
                </div>
              </div>
            )}

            <section className="container mx-auto px-2 sm:px-3 xl:px-3 py-4">
              {/* Título */}
              <div className="mb-2 flex items-center gap-3">
                <Button variant="calculate" size="sm" onClick={() => navigate("/")} aria-label="Back">← Back</Button>
                <h1 className="text-[24px] md:text-[28px] font-bold text-foreground">
                  {title}
                </h1>
              </div>
              <div className="mb-4 text-sm text-muted-foreground">{totalCount} calculators</div>

              {/* Grid com conteúdo e rail direita */}
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_160px] gap-8">
                {/* Conteúdo principal */}
                <div className="skn-typography space-y-6 max-w-[880px] w-full mr-auto">
                  {/* Intro com Read more colapsável, alinhado à esquerda */}
                  {intro && (
                    <>
                      <div className={`text-[15px] leading-[26px] text-muted-foreground ${introExpanded ? "" : "line-clamp-3"}`}>
                        {intro}
                      </div>
                      {!introExpanded && (
                        <button
                          type="button"
                          className="mt-2 text-[14px] font-medium text-primary hover:text-primary/80 underline underline-offset-2"
                          onClick={() => setIntroExpanded(true)}
                          aria-label="Read more"
                        >
                          Read more
                        </button>
                      )}
                    </>
                  )}

                  {/* Seções e listas (2 colunas em md+) */}
                  <div className="space-y-4">
                    {sections.map((section, idx) => (
                      <div key={`${section.title}-${idx}`} className="pt-4">
                        <div className="mb-3 flex items-center gap-2">
                          {section.icon ? (
                            <span className="text-xl leading-none" aria-hidden>
                              {section.icon}
                            </span>
                          ) : null}
                          <h2 className="text-[18px] font-semibold text-foreground">
                            {section.title} <span className="text-sm font-normal text-muted-foreground">({section.items.length})</span>
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <CalculatorListBlue items={section.items.slice(0, Math.ceil(section.items.length / 2))} />
                          <CalculatorListBlue items={section.items.slice(Math.ceil(section.items.length / 2))} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {recommendedFooter ? (
                    <div className="pt-4">
                      {recommendedFooter}
                    </div>
                  ) : null}
                </div>

                {/* Rail direita sticky em desktop */}
                {showRightRail && (
                  <div className="hidden xl:block">
                    <div className="sticky top-6 w-[160px]">
                      <RightRailAds />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>

          <AdRailLayout topCenterAd={false} bottomCenterAd={false} showRails={true} showLeftRail={false} showRightRail={true} className="pb-0">
            <section className="mt-4 skn-typography text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <SiteFeedbackForm title="Questions or suggestions?" compact={true} />
                    <ShareThisCalculator />
                  </div>
                </div>
            </section>
          </AdRailLayout>
          {/* Footer moved outside to ensure it always uses theme-aware background */}
        </div>
      ) : (
        <>
          <main className="pt-20">
            {/* Top banner (90px) */}
            {showTopBanner && (
              <div className="container mx-auto px-4">
                <div className="mb-4 h-[90px] flex items-center justify-center">
                  <AdSlot variant="banner" label="Ad - Top Banner (Google AdSense)" />
                </div>
              </div>
            )}

            <section className="container mx-auto px-2 sm:px-3 xl:px-3 py-4">
              {/* Título */}
              <div className="mb-2 flex items-center gap-3">
                <Button variant="calculate" size="sm" onClick={() => navigate("/")} aria-label="Back">← Back</Button>
                <h1 className="text-[24px] md:text-[28px] font-bold text-foreground">
                  {title}
                </h1>
              </div>
              <div className="mb-4 text-sm text-muted-foreground">{totalCount} calculators</div>

              {/* Grid com conteúdo e rail direita */}
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_160px] gap-8">
                {/* Conteúdo principal */}
                <div className="skn-typography space-y-6 max-w-[880px] w-full mr-auto">
                  {/* Intro com Read more colapsável, alinhado à esquerda */}
                  {intro && (
                    <>
                      <div className={`text-[15px] leading-[26px] text-muted-foreground ${introExpanded ? "" : "line-clamp-3"}`}>
                        {intro}
                      </div>
                      {!introExpanded && (
                        <button
                          type="button"
                          className="mt-2 text-[14px] font-medium text-primary hover:text-primary/80 underline underline-offset-2"
                          onClick={() => setIntroExpanded(true)}
                          aria-label="Read more"
                        >
                          Read more
                        </button>
                      )}
                    </>
                  )}

                  {/* Seções e listas (2 colunas em md+) */}
                  <div className="space-y-4">
                    {sections.map((section, idx) => (
                      <div key={`${section.title}-${idx}`} className="pt-4">
                        <div className="mb-3 flex items-center gap-2">
                          {section.icon ? (
                            <span className="text-xl leading-none" aria-hidden>
                              {section.icon}
                            </span>
                          ) : null}
                          <h2 className="text-[18px] font-semibold text-foreground">
                            {section.title} <span className="text-sm font-normal text-muted-foreground">({section.items.length})</span>
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <CalculatorListBlue items={section.items.slice(0, Math.ceil(section.items.length / 2))} />
                          <CalculatorListBlue items={section.items.slice(Math.ceil(section.items.length / 2))} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {recommendedFooter ? (
                    <div className="pt-4">
                      {recommendedFooter}
                    </div>
                  ) : null}
                </div>

                {/* Rail direita sticky em desktop */}
                {showRightRail && (
                  <div className="hidden xl:block">
                    <div className="sticky top-6 w-[160px]">
                      <RightRailAds />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>

          <AdRailLayout topCenterAd={false} bottomCenterAd={false} showRails={true} showLeftRail={false} showRightRail={true} className="pb-0">
            <section className="mt-4 skn-typography text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <SiteFeedbackForm title="Questions or suggestions?" compact={true} />
                    <ShareThisCalculator />
                  </div>
                </div>
            </section>
          </AdRailLayout>
          {/* Footer moved outside to ensure consistent theming */}
         </>
       )}
      <Footer />
     </div>
   );
}