import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ArrowLeft } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import {
  listByCategorySubcategory,
  SUBCATEGORY_TITLES,
  FRIENDLY_TITLES,
  subcategoryIcon,
} from "@/data/calculatorRegistry";
import { PALETTE } from "@/components/theme/palette";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function CategorySubcategory() {
  const navigate = useNavigate();
  const { category = "", subcategory = "" } = useParams<{ category: string; subcategory: string }>();

  const calculators = listByCategorySubcategory(category, subcategory);

  const prettySubcat =
    SUBCATEGORY_TITLES[subcategory] ??
    subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  const subtitle =
    subcategory === "wall-ceiling-calculators"
      ? "Choose a calculator below to get started."
      : "Professional construction calculators for accurate project planning and material estimation.";

  return (
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
              {/* Back à esquerda */}
              <button
                onClick={() => navigate(`/${category}`)}
                className="mb-4 inline-flex items-center gap-2 rounded-md px-3 py-2 md:py-2.5 text-white hover:brightness-110 transition-colors"
                style={{ backgroundColor: PALETTE.brand.button }}
                aria-label={`Back to ${category}`}
              >
                <ArrowLeft className="h-4 w-4" />
        Back
              </button>

              {/* Título alinhado à esquerda com ícone */}
              <h1 className="text-4xl font-bold mb-3 flex items-center gap-2" style={{ color: PALETTE.brand.title }}>
                <span aria-hidden="true">{subcategoryIcon(subcategory, category)}</span>
                {prettySubcat}
              </h1>
              <p className="text-lg max-w-3xl" style={{ color: PALETTE.brand.text }}>
                Choose a calculator below to get started.
              </p>
            </div>
          }
        >
          {calculators.length === 0 ? (
            <p className="text-center" style={{ color: PALETTE.brand.text }}>
              No calculators found.
            </p>
          ) : (
            <ul className="space-y-4">
              {calculators.map((calc) => {
                const url = `/${category}/${calc.slug}`;
                return (
                  <li key={calc.slug} className="bg-card border border-border/50 rounded-md p-4">
                    <h2 className="text-lg font-semibold">
                      <CalculatorLink to={url}>{calc.title}</CalculatorLink>
                    </h2>
                    <p className="text-sm mt-1" style={{ color: PALETTE.brand.text }}>
                      {calc.description || "Open the calculator"}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Feedback + Share section above footer */}
          <section className="mt-4 skn-typography text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <SiteFeedbackForm title="Questions or suggestions?" includeFile={false} compact={true} />
                  <ShareThisCalculator />
                </div>
              </div>
          </section>
        </AdRailLayout>
      </main>
    </div>
  );
}
