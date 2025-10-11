// src/pages/FinancialCalculators.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  listSubcategoriesOfCategory,
  listByCategorySubcategory,
  FRIENDLY_TITLES,
  subcategoryIcon,
  categoryIcon,
} from "@/data/calculatorRegistry";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function FinancialCalculators() {
  const navigate = useNavigate();
  const category = "financial";
  const subcats = listSubcategoriesOfCategory(category);
  const categoryTitle = FRIENDLY_TITLES[category] || "Financial Calculators";
  const [descOpen, setDescOpen] = useState(false);

  // Soma total de calculadoras das subcategorias (mostrado abaixo do H1)
  const totalCount = subcats.reduce((acc, sc) => acc + (Number(sc.count) || 0), 0);

  return (
    // usa as cores globais do tema (light/dark) e não força gradiente
    <div className="min-h-screen">
      <SEOHead
        title={`${categoryTitle} · SmartKitNow`}
        description="Plan loans, investments, and personal budgets with clear, transparent math. Compare rates, project returns, estimate taxes, and make confident money decisions."
        canonical="https://www.smartkitnow.com/financial"
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: categoryTitle, url: "https://www.smartkitnow.com/financial" },
        ]}
      />

      <Header />

      {/* espaço controlado pela página: garante que o conteúdo fique abaixo do header */}
      <main className="mt-[156px] md:mt-[176px] pb-28">
        <PageWithRails
          titleBlock={
            <div className="text-left">
              <div className="mb-6 text-left">
                <Button
                  variant="default"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 px-3 py-2 md:py-2.5"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              {/* H1 visível */}
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2" style={{ color: "#5c82ee" }}>
                <span className="text-[30px] leading-none select-none" aria-hidden="true">
                  {categoryIcon("financial")}
                </span>
                {categoryTitle}
              </h1>

              {/* Contagem total imediatamente abaixo do título */}
              <div className="text-sm mb-3" style={{ color: "#9aa0ae" }}>
                {totalCount} calculators
              </div>

              {/* ÚNICA descrição (sem duplicar) e mais estreita para conviver com right-rail ads */}
              <p className={`${descOpen ? "" : "line-clamp-3"} text-lg max-w-[740px]`} style={{ color: "#747886" }}>
                Money touches every decision we make—choosing a mortgage, planning a budget, comparing loans, estimating taxes, or deciding where to invest. Our Financial Calculators are built to turn uncertainty into clear, actionable numbers. Each tool uses transparent formulas, sensible defaults, and instant results so you can compare rates, project returns, model monthly payments, forecast long-term savings, and understand the real impact of interest, fees, and inflation. Whether you’re a business owner validating cash flow, a student learning finance, or simply planning for everyday life, you’ll get fast, accurate calculations you can trust and share.
                <br />
                <br />
                Browse focused sections for Loan & Interest, Investment, Personal Finance, Tax & Income, Debt & Credit, and Currency & Inflation. Learn as you calculate with plain-English explanations and examples, then adjust inputs to see how small changes affect outcomes. Make confident money decisions—quickly, clearly, and with zero guesswork.
              </p>
              {!descOpen && (
                <button
                  className="mt-2 inline-flex items-center text-primary hover:text-primary/80 text-sm"
                  onClick={() => setDescOpen(true)}
                >
                  Read More
                </button>
              )}
            </div>
          }
          showRails
          showLeftRail={false}
          showRightRail={true}
          showTopBanner
          showBottomBanner
          railsSticky={false}
        >
          {/* Seções por subcategoria (ícone + heading) e listas em 2 colunas */}
          <div className="space-y-10">
            {subcats.map((sc) => {
              const emoji = subcategoryIcon(sc.slug, category);
              const calcs = listByCategorySubcategory(category, sc.slug) || [];
              // divide em 2 colunas (metade/ metade)
              const mid = Math.ceil(calcs.length / 2);
              const colA = calcs.slice(0, mid);
              const colB = calcs.slice(mid);
              return (
                <section key={sc.slug}>
                  {/* Título da subcategoria com ícone */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[20px] leading-none select-none" aria-hidden="true">
                      {emoji}
                    </span>
                    <h2 className="text-[22px] md:text-[24px] font-semibold tracking-[-0.01em] text-foreground">
                      {sc.title}
                    </h2>
                    <span className="text-sm skn-text-muted">({sc.count})</span>
                  </div>

                  {/* Listas em 2 colunas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <ul className="list-disc pl-5 space-y-3 leading-7">
                      {colA.map((c) => (
                        <li key={c.slug}>
                          <CalculatorLink to={`/${category}/${c.slug}`}>{c.title}</CalculatorLink>
                        </li>
                      ))}
                    </ul>
                    <ul className="list-disc pl-5 space-y-3 leading-7 mt-3 md:mt-0">
                      {colB.map((c) => (
                        <li key={c.slug}>
                          <CalculatorLink to={`/${category}/${c.slug}`}>{c.title}</CalculatorLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })}
          </div>
        </PageWithRails>
      </main>
    </div>
  );
}
