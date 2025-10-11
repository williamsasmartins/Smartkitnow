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
  // Contagem total de calculadoras na categoria atual
  const totalInCategory = listByCategory(category).length;

  // Icons now provided by centralized util subcategoryIcon from calculatorRegistry

  return (
    <div className="min-h-screen bg-gradient-soft">

{/* Banner horizontal no topo (abaixo da barra de navegação) */}
      <div className="container mx-auto px-4 mt-6 mb-2">
        <div className="flex justify-center items-center min-h-[100px]">
          <AdSlot variant="banner" label="Ad - Top Banner (Google AdSense)" />
        </div>
      </div>

      <div className="min-h-screen bg-background">
{/* Main Content Area - Add top padding to account for fixed header */}
      <main className="pt-20">
        <AdRailLayout
          topCenterAd={false}
          bottomCenterAd={false}
          showRails={true}
          showLeftRail={false}
          showRightRail={true}
          titleBlock={
            <div className="max-w-5xl">
              {/* Botão Back (esquerda) */}
              <button
                onClick={() => navigate("/")}
                className="mb-4 inline-flex items-center gap-2 rounded-md px-3 py-2 md:py-2.5 text-white hover:brightness-110 transition-colors"
                style={{ backgroundColor: PALETTE.brand.button }}
                aria-label="Back to Home"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {/* Título/Introdução */}
              <h1 className="text-4xl font-bold mb-1" style={{ color: PALETTE.brand.title }}>
                {title}
              </h1>
              {category === "health" ? (
                <div className="mt-1">
                  <p className="text-sm text-muted-foreground">{totalInCategory} calculators</p>
                  <div className="mt-2">
                    <p
                      className={`${healthCopyOpen ? "" : "line-clamp-3"} text-base max-w-3xl`}
                      style={{ color: PALETTE.brand.text }}
                    >
                      {"Discover smarter ways to take control of your health. Whether you’re a healthcare professional, a student or simply someone looking to understand your body better, our collection of health and fitness calculators delivers accurate, science‑based answers. Need to estimate your basal metabolic rate (BMR) or body mass index (BMI)? Wondering how much water you should drink each day, or what your heart rate zones should be during exercise? We’ve curated tools that tackle these questions and many more — from body composition and nutrition to fitness performance and pregnancy metrics. Every calculator on Smart Kit Now is backed by credible sources and designed to be easy to use. You’ll find guidance for dosing medications, interpreting blood values, assessing risk factors and planning workouts, all in one place. Our goal is to make complex medical formulas accessible and actionable so you can make informed decisions about your health and wellbeing. Browse the topics below to explore the full range of calculators, and feel confident taking the next step toward a healthier you."}
                    </p>
                    {!healthCopyOpen && (
                      <button
                        className="text-primary text-sm underline mt-2 px-0 py-0"
                        onClick={() => setHealthCopyOpen(true)}
                        aria-label="Read more"
                      >
                        Read more
                      </button>
                    )}
                  </div>
                </div>
              ) : (
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
                          {"Put your finances on track with reliable calculators. Whether you’re a market professional, a small business owner, an aspiring investor or just someone who wants to balance the household budget, our financial tools help you make informed choices. Need to compare loans and mortgages? Plan for retirement? Calculate investment returns or tax impacts? Here you’ll find clear and accurate formulas — from compound interest and ROI to cash flow and profit margins. Every calculator is based on established methods and designed to simplify complex tasks: simulate different financing scenarios, project your future wealth with our retirement calculators, estimate monthly payments and total costs before buying a car or a home. By bringing numerous applications into one place, we make life easier for anyone looking to organise personal finances or optimise business management. Browse the sections below to find the right tool for you and turn numbers into smart decisions."}
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
                              items={calculators.map((calc) => ({ title: calc.title, to: `/${category}/${calc.slug}` }))}
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
                          items={calculators.map((calc) => ({ title: calc.title, to: `/${category}/${calc.slug}` }))}
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
  </div>
);
}
