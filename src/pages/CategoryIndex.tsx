import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { ArrowLeft } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import AdSlot from "@/components/ads/AdSlot";
import {
  FRIENDLY_TITLES,
  listSubcategoriesOfCategory,
  listByCategorySubcategory,
  listByCategory,
  subcategoryIcon,
  calcLink,
} from "@/data/calculatorRegistry";
import { PALETTE } from "@/components/theme/palette";
import CalculatorListBlue from "@/components/common/CalculatorListBlue";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";

export default function CategoryIndex() {
  const navigate = useNavigate();
  const { category = "" } = useParams<{ category: string }>();

  const title =
    FRIENDLY_TITLES[category] ??
    category.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const subcats = listSubcategoriesOfCategory(category);

  // Estado para controlar o comportamento "Read more" da copy em Health
  const [healthCopyOpen, setHealthCopyOpen] = useState(false);
  // Estado para controlar o comportamento "Read more" da copy em Financial
  const [financialCopyOpen, setFinancialCopyOpen] = useState(false);

  const totalInCategory = listByCategory(category).length;

  return (
    <div className="min-h-screen">
      <main className="pt-48 sm:pt-20">
        <AdRailLayout
          titleBlock={
            <div className="text-left">
              <div className="mb-6 text-left">
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 md:py-2.5 rounded-md"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2" style={{ color: PALETTE.brand.title }}>
                <span className="text-[26px] leading-none select-none" aria-hidden="true">🏷️</span>
                {title}
              </h1>
              {category !== "financial" && (
                <p className="text-lg max-w-2xl" style={{ color: PALETTE.brand.text }}>
                  Explore practical {title.replace(/ Calculators$/, "").toLowerCase()} calculators designed to help you plan, measure, and make better decisions.
                </p>
              )}
              {category === "financial" && (
                <>
                  <p className="text-lg max-w-2xl" style={{ color: PALETTE.brand.text }}>
                    Explore practical {title.replace(/ Calculators$/, "").toLowerCase()} calculators designed to help you plan, measure, and make better decisions.
                  </p>
                  {category === "financial" && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">{totalInCategory} calculators</p>
                      <div className="mt-2">
                        <p
                          className={`${financialCopyOpen ? "" : "line-clamp-3"} text-base max-w-3xl`}
                          style={{ color: PALETTE.brand.text }}
                        >
                          {"Put your finances on track with reliable calculators. Whether you’re a market professional, a small business owner, an aspiring investor or just someone who wants to balance the household budget, our financial tools help you make informed choices. Need to compare loans quickly? Want to see how a small change impacts the long-term outcome? These calculators are built to give you clear, actionable numbers with transparent formulas and sensible defaults."}
                        </p>
                        {!financialCopyOpen && (
                          <button
                            className="text-primary text-sm underline mt-2 px-0 py-0"
                            onClick={() => setFinancialCopyOpen(true)}
                            aria-label="Read more"
                          >
                            Read more
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          }
        >
          {subcats.length === 0 ? (
            <p className="text-left" style={{ color: PALETTE.brand.text }}>
              No subcategories found.
            </p>
          ) : (
            category === "financial" ? (
              // Grid com introdução à direita e listas à esquerda
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Listas de calculadoras (duas colunas) */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subcats.map((sc) => {
                      const calculators = listByCategorySubcategory(category, sc.slug);
                      return (
                        <section
                          key={sc.slug}
                          className="bg-card/40 border border-border/50 rounded-lg p-4 shadow-sm"
                        >
                          <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: PALETTE.brand.title }}>
                            <span aria-hidden="true">{subcategoryIcon(sc.slug, category)}</span>
                            {sc.title}
                          </h2>
                          <div className="mt-3">
                            <CalculatorListBlue
                              items={calculators.map((calc) => ({ title: calc.title, to: calcLink(calc) }))}
                            />
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </div>


              </div>
            ) : (
              // Layout padrão para demais categorias
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subcats.map((sc) => {
                  const calculators = listByCategorySubcategory(category, sc.slug);
                  return (
                    <section
                      key={sc.slug}
                      className="bg-card/40 border border-border/50 rounded-lg p-4 shadow-sm"
                    >
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: PALETTE.brand.title }}>
                        <span aria-hidden="true">{subcategoryIcon(sc.slug, category)}</span>
                        {sc.title}
                      </h2>
                      <div className="mt-3">
                        <CalculatorListBlue
                          items={calculators.map((calc) => ({ title: calc.title, to: calcLink(calc) }))}
                        />
                      </div>
                    </section>
                  );
                })}
              </div>
            )
          )}

          <section className="mt-6 skn-typography text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <SiteFeedbackForm title="Questions or suggestions?" compact={true} />
                  <ShareThisCalculator />
                </div>
              </div>
          </section>
        </AdRailLayout>
      </main>
    </div>
  );
}
