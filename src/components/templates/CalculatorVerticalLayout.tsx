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
// COMPONENTE: "On This Page" Navigation - ÂNCORA CORRIGIDA
// ================================================================
interface OnThisPageSection {
  id: string;
  label: string;
}

function OnThisPageNav({ sections }: { sections: OnThisPageSection[] }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    const element = document.getElementById(id);
    if (element) {
      // Offset para compensar header fixo (120px)
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Atualizar URL sem recarregar
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <nav className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 dark:border-blue-400 p-5 rounded-lg mb-8 shadow-sm">
      <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-base">
        On this page:
      </p>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a 
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline text-sm font-medium transition-colors cursor-pointer"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ================================================================
// COMPONENTE: Formula Box (InchCalculator + OmniCalculator style)
// ================================================================
interface FormulaVariable {
  symbol: string;
  description: string;
}

function FormulaBox({ 
  formula, 
  variables,
  title = "Formula"
}: { 
  formula: string; 
  variables: FormulaVariable[];
  title?: string;
}) {
  return (
    <div className="my-10 p-8 rounded-2xl border-4 border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 shadow-lg">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white dark:bg-gray-900 rounded-xl px-8 py-4 shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 shadow-md">
        <p className="text-center text-3xl font-mono font-bold text-gray-900 dark:text-gray-100 break-words">
          {formula}
        </p>
      </div>

      {/* Variables */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-lg">
          Where:
        </p>
        <div className="space-y-3">
          {variables.map((variable) => (
            <div key={variable.symbol} className="flex items-start gap-3">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-lg min-w-[3rem]">
                {variable.symbol}
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                = {variable.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: Example Calculation (InchCalculator style)
// ================================================================
interface ExampleStep {
  step: number;
  description: string;
  calculation?: string;
}

function ExampleSection({ 
  title, 
  scenario, 
  steps, 
  result 
}: { 
  title: string;
  scenario: string;
  steps: ExampleStep[];
  result: string;
}) {
  return (
    <div className="my-8 p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h3>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {scenario}
      </p>

      <div className="space-y-4 mb-6">
        {steps.map((step) => (
          <div key={step.step} className="bg-white dark:bg-gray-900 p-4 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Step {step.step}: {step.description}
            </p>
            {step.calculation && (
              <p className="font-mono text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 p-3 rounded">
                {step.calculation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-500 p-4 rounded">
        <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
          Result: {result}
        </p>
      </div>
    </div>
  );
}

// ================================================================
// COMPONENTE: Related Calculators (OmniCalculator style)
// ================================================================
interface RelatedCalc {
  title: string;
  url: string;
  icon?: string;
}

function RelatedCalculators({ calculators }: { calculators: RelatedCalc[] }) {
  if (calculators.length === 0) return null;

  return (
    <div className="my-8 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-200 dark:border-purple-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span>🔗</span> Related Calculators
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {calculators.map((calc) => (
          <a
            key={calc.url}
            href={calc.url}
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow group"
          >
            {calc.icon && <span className="text-2xl">{calc.icon}</span>}
            <span className="text-blue-600 dark:text-blue-400 group-hover:underline font-medium">
              {calc.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ================================================================
// PROPS DO LAYOUT MELHORADO
// ================================================================
interface CalculatorVerticalLayoutProps {
  title: string;
  description?: string;
  widget: ReactNode;
  editorial: ReactNode;
  
  // Navigation
  onThisPage?: OnThisPageSection[];
  
  // Optional Components
  formula?: {
    formula: string;
    variables: FormulaVariable[];
    title?: string;
  };
  example?: {
    title: string;
    scenario: string;
    steps: ExampleStep[];
    result: string;
  };
  relatedCalculators?: RelatedCalc[];
  
  // Ad Controls
  showTopBanner?: boolean;
  showSidebar?: boolean;
  showBottomBanner?: boolean;
}

// ================================================================
// LAYOUT PRINCIPAL - VERSÃO PREMIUM SUPER CORRIGIDA
// ================================================================
export default function CalculatorVerticalLayout({
  title,
  description,
  widget,
  editorial,
  onThisPage,
  formula,
  example,
  relatedCalculators,
  showTopBanner = true,
  showSidebar = true,
  showBottomBanner = true,
}: CalculatorVerticalLayoutProps) {
  return (
    <div className="skn-vertical-layout min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* ============================================================
          CONTAINER PRINCIPAL (Max 1200px, Centralizado)
          ============================================================ */}
      <div className="mx-auto pb-10 pt-24" style={{ maxWidth: 1200 }}>
        
        {/* ========================================================
            TOP BANNER AD (Responsivo: 970×90 / 728×90 / 320×100)
            AGORA COM MARGIN-TOP PARA FICAR VISÍVEL
            ======================================================== */}
        {showTopBanner && (
          <AdUnit 
            slot={SLOT_TOP_BANNER}
            type="top-banner"
            className="mb-6"
          />
        )}

        {/* ========================================================
            LAYOUT COM SIDEBAR + CONTEÚDO
            ======================================================== */}
        <div className="relative">
          {/* SIDEBAR FLUTUANTE (Desktop Only, STICKY AGORA) */}
          {showSidebar && (
            <aside className="hidden xl:block skn-sidebar-sticky">
              <AdUnit 
                slot={SLOT_SIDEBAR}
                type="sidebar"
              />
            </aside>
          )}

          {/* CONTEÚDO CENTRALIZADO (Max 768px) */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            
            {/* TÍTULO */}
            <header className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              )}
            </header>

            {/* ON THIS PAGE NAVIGATION - ÂNCORA CORRIGIDA */}
            {onThisPage && onThisPage.length > 0 && (
              <OnThisPageNav sections={onThisPage} />
            )}

            {/* WIDGET DA CALCULADORA */}
            <section 
              className="mb-8 rounded-xl overflow-hidden border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 shadow-lg transition-colors"
            >
              <div className="p-6">
                {widget}
              </div>
            </section>

            {/* FORMULA BOX (se fornecido) */}
            {formula && (
              <FormulaBox
                formula={formula.formula}
                variables={formula.variables}
                title={formula.title}
              />
            )}

            {/* EXAMPLE CALCULATION (se fornecido) */}
            {example && (
              <ExampleSection
                title={example.title}
                scenario={example.scenario}
                steps={example.steps}
                result={example.result}
              />
            )}

            {/* CONTEÚDO EDITORIAL */}
            <article 
              id="content" 
              className="mb-8 prose prose-lg prose-blue max-w-none dark:prose-invert"
            >
              <div className="text-gray-900 dark:text-gray-100 leading-relaxed skn-editorial-sections">
                {editorial}
              </div>
            </article>

            {/* RELATED CALCULATORS (se fornecido) */}
            {relatedCalculators && relatedCalculators.length > 0 && (
              <RelatedCalculators calculators={relatedCalculators} />
            )}

            {/* BOTTOM BANNER AD */}
            {showBottomBanner && (
              <AdUnit 
                slot={SLOT_BOTTOM_BANNER}
                type="bottom-banner"
                className="mb-8"
              />
            )}

            {/* DISCLAIMER LEGAL (VISUAL MELHORADO) */}
            <LegalDisclaimer />

            {/* SHARE THIS PAGE (VISUAL MELHORADO) */}
            <ShareThisPageBox />

            {/* SUGGESTION BOX (VISUAL MELHORADO) */}
            <SuggestionBox />
          </div>
        </div>
      </div>

      {/* ============================================================
          CSS CUSTOMIZADO
          ============================================================ */}
      <style jsx>{`
        /* Sidebar STICKY - Para no Footer */
        .skn-sidebar-sticky {
          position: sticky;
          top: 120px;
          right: max(1rem, calc((100vw - 1200px) / 2 - 320px));
          width: 300px;
          height: fit-content;
          max-height: calc(100vh - 140px);
          margin-left: auto;
          z-index: 10;
          float: right;
          margin-right: calc((100vw - 1200px) / 2 - 320px);
        }

        /* Ajustes para telas muito grandes */
        @media (min-width: 1600px) {
          .skn-sidebar-sticky {
            margin-right: calc((100vw - 1200px) / 2 - 320px);
          }
        }

        /* Hide sidebar em telas menores */
        @media (max-width: 1279px) {
          .skn-sidebar-sticky {
            display: none;
          }
        }

        /* Smooth scroll para navigation */
        html {
          scroll-behavior: smooth;
        }

        /* CORREÇÃO ÂNCORA: Scroll margin para sections */
        .skn-editorial-sections section {
          scroll-margin-top: 120px;
        }

        /* Garantir que sidebar não ultrapasse o footer */
        .skn-vertical-layout {
          position: relative;
        }
      `}</style>
    </div>
  );
}
